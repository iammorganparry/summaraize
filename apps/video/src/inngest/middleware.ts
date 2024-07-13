import { InngestMiddleware } from "inngest";
import { VideoService } from "../services/video";
import { logger } from "../lib/logger";
import Ffmpeg from "fluent-ffmpeg";
import { OpenAiService, getOpenAI } from "../services/openai";
import ytdl from "@distube/ytdl-core";
import { db } from "@summaraize/prisma";
import { pusher } from "@summaraize/pusher";
import { ImageService } from "../services/images";
import { utapi } from "../services/uploadthing";
import { xata } from "@summaraize/xata";
import { XataService } from "../services/xata";

export const servicesMiddleware = new InngestMiddleware({
  name: "Summaraize Services Middleware",
  init() {
    const ai = getOpenAI();
    const videoService = new VideoService(
      db,
      xata,
      ytdl,
      Ffmpeg,
      pusher,
      logger
    );

    const xataService = new XataService(xata, db, logger);

    const openai = new OpenAiService(ai, logger);

    const images = new ImageService(utapi, logger);
    return {
      onFunctionRun() {
        return {
          transformInput() {
            return {
              ctx: {
                services: {
                  xata: xataService,
                  pusher: pusher,
                  video: videoService,
                  images,
                  ai: openai,
                },
              },
            };
          },
        };
      },
    };
  },
});
