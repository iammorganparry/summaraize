import { OpenAiService, getOpenAI } from "./services/openai";
import { logger } from "./lib/logger";
import { xata } from "@summaraize/xata";
import { createMiddleware } from "hono/factory";
import { XataService } from "./services/xata";
import { db } from "@summaraize/prisma";
import { replicate } from "./services/replicate";

const ai = new OpenAiService(getOpenAI(), logger);
const xataService = new XataService(xata, db, logger);
export const summaraizeServices = createMiddleware<{
  Variables: {
    ai: OpenAiService;
    xata: XataService;
    replicate: typeof replicate;
  };
}>(async (c, next) => {
  c.set("ai", ai);
  c.set("replicate", replicate);
  c.set("xata", xataService);
  await next();
});
