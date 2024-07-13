import { OpenAiService, getOpenAI } from "./services/openai";
import { logger } from "./lib/logger";
import { xata } from "@summaraize/xata";
import { createMiddleware } from "hono/factory";

const ai = new OpenAiService(getOpenAI(), logger);

export const summaraizeServices = createMiddleware<{
  Variables: {
    ai: OpenAiService;
    xata: typeof xata;
  };
}>(async (c, next) => {
  c.set("ai", ai);
  c.set("xata", xata);
  await next();
});
