import { OpenAiService, getOpenAI } from "./services/openai";
import { logger } from "./lib/logger";
import { xata } from "@thatrundown/xata";
import { createMiddleware } from "hono/factory";
import { XataService } from "./services/xata";
import { db } from "@thatrundown/prisma";

const ai = new OpenAiService(getOpenAI(), logger);
const xataService = new XataService(xata, db, logger);
export const thatrundownServices = createMiddleware<{
  Variables: {
    ai: OpenAiService;
    xata: XataService;
  };
}>(async (c, next) => {
  c.set("ai", ai);
  c.set("xata", xataService);
  await next();
});
