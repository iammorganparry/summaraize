import { Hono } from "hono";
import { thatrundownServices } from "../middlware";
import { openai } from "@ai-sdk/openai";
import { SSEStreamingApi, streamSSE, streamText } from "hono/streaming";
import { streamText as streamTextResponse, type Message } from "ai";
import type { AskResult } from "@xata.io/client";

export const aiChatRoute = new Hono();

aiChatRoute.post("/", thatrundownServices, async (c) => {
  const data = (await c.req.json()) as {
    question: string;
    sessionId?: string;
  };
  const sessionId = data?.sessionId;
  const clerk = c.get("clerkAuth");
  const userId = clerk?.userId;
  const xata = c.get("xata");
  const { readable, writable } = new TransformStream({
    start() {
      xata.api.db.Summary.ask(data.question, {
        rules: [
          "Your name is Sandra, and you are a bot. But the best bot ever! 🤖",
          "If you are not sure about the answer, just ask me again.",
        ],
        searchType: "keyword",
        sessionId,
        search: {
          fuzziness: 2,
          filter: {
            user_id: userId as string,
          },
          prefix: "phrase",
          target: ["summary", { column: "name", weight: 4 }, "transcription"],
        },
        onMessage: async (message: AskResult) => {
          stream.writeSSE({
            data: JSON.stringify(message),
          });
        },
      });
    },
  });

  const stream = new SSEStreamingApi(writable, readable);

  c.header("Content-Type", "text/event-stream");
  c.header("Cache-Control", "no-cache");
  c.header("Connection", "keep-alive");

  return c.newResponse(stream.responseReadable);
});
