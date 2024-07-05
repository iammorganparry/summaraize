import { InngestMiddleware } from "inngest";
import { openai } from "~/services/ai/client";
import { OpenAIService } from "~/services/ai/openai";
import { logger } from "~/lib/logger";
import Ffmpeg from "fluent-ffmpeg";

export const servicesMiddleware = new InngestMiddleware({
  name: "Summaraize Services Middleware",
  init() {
    const openAiService = new OpenAIService(openai, logger);
    return {
      onFunctionRun() {
        return {
          transformInput() {
            return {
              ctx: {
                services: {
                  openai: openAiService,
                },
              },
            };
          },
        };
      },
    };
  },
});
