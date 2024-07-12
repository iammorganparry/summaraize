import { OpenAiService, getOpenAI } from "./services/openai";
import { logger } from "./lib/logger";
import { replicate } from "./services/replicate";
import { getXataClient } from "./services/xata";
import { createMiddleware } from "hono/factory";

const ai = new OpenAiService(getOpenAI(), logger);
const xata = getXataClient();

export const summaraizeServices = createMiddleware<{
  Variables: {
    ai: OpenAiService;
    replicate: typeof replicate;
    xata: ReturnType<typeof getXataClient>;
  };
}>(async (c, next) => {
  c.set("ai", ai);
  c.set("replicate", replicate);
  c.set("xata", xata);
  await next();
});
