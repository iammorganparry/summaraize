import { InngestMiddleware } from "inngest";
import { VideoService } from "../services/video";
import { logger } from "../lib/logger";
import { OpenAiService, getOpenAI } from "../services/openai";
import ytdl from "@distube/ytdl-core";
import { db } from "@thatrundown/prisma";
import { pusher } from "@thatrundown/pusher";
import { ImageService } from "../services/images";
import { utapi } from "../services/uploadthing";
import { xata } from "@thatrundown/xata";
import { XataService } from "../services/xata";

/**
 * @description Ensures we have the correct ffmpeg path
 * @see https://stackoverflow.com/questions/45555960/nodejs-fluent-ffmpeg-cannot-find-ffmpeg
 */
const ffmpegPath = require("@ffmpeg-installer/ffmpeg").path;
const ffmpeg = require("fluent-ffmpeg");
ffmpeg.setFfmpegPath(ffmpegPath);

export const servicesMiddleware = new InngestMiddleware({
  name: "That Rundown Services Middleware",
  init() {
    const ai = getOpenAI();
    const videoService = new VideoService(db, ytdl, ffmpeg, pusher, logger);

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
                  prisma: db,
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
