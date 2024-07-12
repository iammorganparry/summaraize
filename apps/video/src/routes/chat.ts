import { Hono } from "hono";
import { summaraizeServices } from "../middlware";
import type { Message } from "openai/resources/beta/threads/messages.mjs";
import { experimental_buildLlama2Prompt } from "ai/prompts";
import { ReplicateStream, StreamingTextResponse } from "ai";

export const aiChatRoute = new Hono();
aiChatRoute.post("/", summaraizeServices, async (c) => {
  try {
    // Set of messages to create vector embeddings on
    const { messages = [] } = await c.req.json();

    const ai = c.get("ai");
    const xata = c.get("xata");
    const replicate = c.get("replicate");

    const userMessages = messages.filter((i: Message) => i.role === "user");
    const input = userMessages[userMessages.length - 1].content;

    const embeddingData = await ai.generateEmbeddings(input);

    const relevantRecords = await xata.db.Summary.vectorSearch(
      "embedding",
      embeddingData,
      { size: 5 }
    );

    const systemContext = relevantRecords.records
      .map((i) =>
        JSON.stringify({
          title: i.name,
          summary: i.summary,
          url: i.video_url,
        })
      )
      .join("\n");

    const response = await replicate.predictions.create({
      stream: true,
      model: "meta/llama-2-70b-chat",
      input: {
        prompt: experimental_buildLlama2Prompt([
          {
            role: "system",
            content: systemContext,
          },
          {
            role: "assistant",
            content:
              "When creating repsonses be sure to format the output as HTML and not text so that they can be rendered beautifully.",
          },
          // also, pass the whole conversation!
          ...messages,
        ]),
      },
    });

    const stream = await ReplicateStream(response);
    return new StreamingTextResponse(stream);
  } catch (error) {
    console.error("Failed to generate chat response", error);
    return c.json({ error: "Failed to generate chat response " }, 500);
  }
  // Shoutout Xata for the sick tutorial on this
});
