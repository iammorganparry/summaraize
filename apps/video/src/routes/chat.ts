import { Hono } from "hono";
import { thatrundownServices } from "../middlware";
import type { Message } from "openai/resources/beta/threads/messages.mjs";
import { openai } from "@ai-sdk/openai";
import { streamText } from "hono/streaming";
import { streamText as streamTextResponse } from "ai";

export const aiChatRoute = new Hono();
aiChatRoute.post("/", thatrundownServices, async (c) => {
  try {
    return streamText(c, async (stream) => {
      // Set of messages to create vector embeddings on
      const { messages = [] } = await c.req.json();
      const clerk = c.get("clerkAuth");
      const userId = clerk?.userId;

      console.log("user", userId);

      const xata = c.get("xata");

      const userMessages = messages.filter((i: Message) => i.role === "user");
      const input = userMessages[userMessages.length - 1].content;

      const relevantRecords = await xata.semanticSearch(input, userId as string);

      const systemContext = relevantRecords.map((i) => i.pageContent).join("\n");

      const response = await streamTextResponse({
        model: openai.chat("gpt-3.5-turbo", {
          user: userId as string,
        }),
        prompt: `
            Context: ${systemContext}
            User: ${input}
            System:
      `,
      });

      let fullResponse = "";
      for await (const delta of response.textStream) {
        fullResponse += delta;
        stream.write(delta);
      }
    });
  } catch (error) {
    console.error("Failed to generate chat response", error);
    return c.json({ error: "Failed to generate chat response " }, 500);
  }
  // Shoutout Xata for the sick tutorial on this
});
