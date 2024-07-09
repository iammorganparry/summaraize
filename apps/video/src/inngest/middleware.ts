import { InngestMiddleware } from "inngest";
import { VideoService } from "./services/video";
import { logger } from "../lib/logger";
import Ffmpeg from "fluent-ffmpeg";
import { getOpenAI } from "./services/openai";
import ytdl from "ytdl-core";
import { db } from "@summaraize/prisma";
import { pusher } from "@summaraize/pusher";

export const servicesMiddleware = new InngestMiddleware({
  name: "Summaraize Services Middleware",
  init() {
    const videoService = new VideoService(
      db,
      getOpenAI(),
      ytdl,
      Ffmpeg,
      logger
    );
    return {
      onFunctionRun() {
        return {
          transformInput() {
            return {
              ctx: {
                services: {
                  pusher: pusher,
                  video: videoService,
                },
              },
            };
          },
        };
      },
    };
  },
});
