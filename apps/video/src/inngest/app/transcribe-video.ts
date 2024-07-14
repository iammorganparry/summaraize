import { type GetFunctionInput, NonRetriableError } from "inngest";
import { inngest } from "../client";
import { SummaryStage } from "@prisma/client";
import { PusherEvents } from "@summaraize/pusher";

export const _transcribeVideo = async ({
  event,
  services,
  step,
}: GetFunctionInput<typeof inngest, "app/transcribe-video">) => {
  const { src, userId, videoId, summaryRequestId } = event.data;

  const existing = await step.run("check-existing-summary", async () => {
    return await services.video.getSummaryByVideoUrl(src, userId);
  });

  if (existing) {
    return {
      summary: existing,
    };
  }

  const { audioFilePath, outputFilePath, videoMetaData } = await step.run(
    "download-audio-video-file",
    async () => {
      return await services.video.createFilesFromYoutubeUrl(videoId, userId);
    }
  );

  if (!audioFilePath) {
    throw new Error("Failed to download audio file");
  }
  const { text: transcription } = await step.run(
    "transcribe-audio",
    async () => {
      await services.xata.updateSummaryRequest(summaryRequestId, {
        stage: SummaryStage.TRANSCRIBING,
      });
      await services.pusher.sendToUser(userId, PusherEvents.SummaryStep, {
        step: SummaryStage.TRANSCRIBING,
      });
      return await services.ai.transcribe(audioFilePath);
    }
  );

  const { uploadedImages } = await step.run("extract-frames", async () => {
    await services.xata.updateSummaryRequest(summaryRequestId, {
      stage: SummaryStage.EXTRACTING,
    });
    await services.pusher.sendToUser(userId, PusherEvents.SummaryStep, {
      step: SummaryStage.EXTRACTING,
    });
    const frames = await services.video.extractFrames(outputFilePath, userId);
    // save frames to upload thing and return the urls / ids
    const images = await services.images.uploadImagesFromPath(frames);
    return { videoMetaData, uploadedImages: images.data, frames };
  });

  const summary = await step.run(
    "summarize-transcription-and-frames",
    async () => {
      await services.xata.updateSummaryRequest(summaryRequestId, {
        stage: SummaryStage.SUMMARIZING,
      });
      await services.pusher.sendToUser(userId, PusherEvents.SummaryStep, {
        // Thought: could use a real time db change stream on the summary request table instead?
        step: SummaryStage.SUMMARIZING,
      });
      const summary = await services.ai.summarize(
        videoMetaData,
        transcription,
        uploadedImages
      );

      return summary;
    }
  );

  if (!summary.summary) {
    throw new NonRetriableError("Failed to summarize video");
  }

  await step.run("generate-embeddings-and-save", async () => {
    const embeddings = await services.ai.generateEmbeddings(
      `${transcription}\n${summary.summary}`
    );
    await services.xata.saveSummary({
      userId,
      summary: summary,
      transcription,
      videoMetaData,
      videoUrl: src,
      embeddings,
    });

    await services.pusher.sendToUser(userId, PusherEvents.SummaryCompleted, {
      summaryRequestId,
      videoUrl: summary.videoUrl,
    });

    await services.xata.updateSummaryRequest(summaryRequestId, {
      stage: SummaryStage.DONE,
    });
  });

  await step.run("cleanup", async () => {
    await services.video.cleanup({
      userId,
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
    onFailure: async ({ services, event, logger }) => {
      const { event: originalEvent } = event.data;
      logger.error("Failed to transcribe video", event.data.error);
      await services.video.cleanup({
        userId: originalEvent.data.userId,
      });
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

export const cancelSummary = inngest.createFunction(
  {
    id: "app-cancel-summary",
    name: "Cancel Summary",
    onFailure: async ({ services, event, logger }) => {
      const { event: originalEvent } = event.data;
      logger.error("Failed to cancel summary", event.data.error);
      await services.video.cleanup({
        userId: originalEvent.data.userId,
      });
    },
  },
  { event: "app/cancel-transcription" },
  async ({ event, services }) => {
    const { userId, requestId } = event.data;
    try {
      await services.xata.deleteSummaryRequest(requestId);
      await services.video.cleanup({ userId });
    } catch (error) {
      return;
    }
  }
);
