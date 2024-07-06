import { InngestMiddleware } from "inngest";
import { VideoService } from "./services/video";
import { logger } from "../lib/logger";
import Ffmpeg from "fluent-ffmpeg";
import { openai } from "./services/client";
import ytdl from "ytdl-core";
import { db } from "@summaraize/prisma";

export const servicesMiddleware = new InngestMiddleware({
	name: "Summaraize Services Middleware",
	init() {
		const videoService = new VideoService(db, openai, ytdl, Ffmpeg, logger);
		return {
			onFunctionRun() {
				return {
					transformInput() {
						return {
							ctx: {
								services: {
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
