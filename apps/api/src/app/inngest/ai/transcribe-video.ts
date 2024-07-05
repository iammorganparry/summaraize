import type { GetFunctionInput } from "inngest";
import { inngest } from "../client";

export const _transcribeVideo = async ({
  event,
  services,
  step,
}: GetFunctionInput<typeof inngest, "ai/transcribe-video">) => {
  const { src, userId } = event.data;

  const filePath = await step.run("download-video", async () => {
    return await services.openai.createFileFromUrl(src);
  });

  const mp3 = await step.run("extract-audio", () => {
    return services.openai.extractAudioFromVideo(filePath);
  });

  const transcription = await step.run("transcribe", async () => {
    return await services.openai.transcribe(mp3);
  });

  // transcribe the video
  // return the transcription
  return { transcription };
};

export const transcribeVideo = inngest.createFunction(
  {
    id: "ai-transcribe-video",
    name: "Transcribe Video",
    retries: 3,
    throttle: {
      limit: process.env.NODE_ENV !== "development" ? 3 : 10,
      period: "1m",
    },
    concurrency: {
      limit: 3,
      scope: "fn",
      key: "data.userId",
    },
    onFailure: () => {
      // alert the user that the video could not be transcribed
    },
    cancelOn: [
      {
        event: "ai/cancel-transcription",
        match: "data.userId",
      },
    ],
  },
  { event: "ai/transcribe-video" },
  _transcribeVideo
);
