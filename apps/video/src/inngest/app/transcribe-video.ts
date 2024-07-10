import { type GetFunctionInput, NonRetriableError } from "inngest";
import { inngest } from "../client";
import { PusherEvents } from "@summaraize/pusher";

export const _transcribeVideo = async ({
  event,
  services,
  step,
}: GetFunctionInput<typeof inngest, "app/transcribe-video">) => {
  const { src, userId, videoId } = event.data;

  const { audioFilePath, outputFilePath, videoMetaData } = await step.run(
    "download-audio-video-file",
    async () => {
      return await services.video.createFilesFromYoutubeUrl(videoId);
    }
  );

  if (!audioFilePath) {
    throw new Error("Failed to download audio file");
  }
  const { text: transcription } = await step.run(
    "transcribe-audio",
    async () => {
      return await services.video.transcribe(audioFilePath);
    }
  );

  const { uploadedImages, frames } = await step.run(
    "extract-frames",
    async () => {
      const frames = await services.video.extractFrames(outputFilePath);
      // save frames to upload thing and return the urls / ids
      const images = await services.images.uploadImagesFromPath(frames);
      return { videoMetaData, uploadedImages: images.data, frames };
    }
  );

  const summary = await step.run(
    "summarize-transcription-and-frames",
    async () => {
      return await services.video.summarise(
        videoMetaData,
        transcription,
        uploadedImages
      );
    }
  );

  if (summary.choices.length === 0 || !summary.choices[0].message?.content) {
    throw new NonRetriableError("Failed to summarize video");
  }

  await step.run("save-summary-and-alert", async () => {
    await services.video.saveSummary({
      userId,
      summary: summary.choices[0].message.content as string,
      transcription,
      videoMetaData,
      videoUrl: src,
    });
    await services.pusher.sendToUser(userId, PusherEvents.SummaryCreated, {
      summary: summary.choices[0].message.content as string,
    });
  });

  await step.run("cleanup", async () => {
    await services.video.cleanup({
      audioFilePath,
      outputFilePath,
      frames,
    });
  });

  return { summary: summary };
};

export const transcribeVideo = inngest.createFunction(
  {
    id: "app-transcribe-video",
    name: "Transcribe Video",
    retries: 3,
    throttle: {
      limit: process.env.NODE_ENV !== "development" ? 3 : 10,
      period: "30s",
    },
    concurrency: {
      limit: 1,
      scope: "fn",
      key: "data.userId",
    },
    onFailure: () => {
      // alert the user that the video could not be transcribed
    },
    cancelOn: [
      {
        event: "app/cancel-transcription",
        if: "async.data.userId == event.data.userId && async.data.src == event.data.src",
        match: "data.userId",
      },
    ],
  },
  { event: "app/transcribe-video" },
  _transcribeVideo
);
