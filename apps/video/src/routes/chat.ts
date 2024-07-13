import { Hono } from "hono";
import { summaraizeServices } from "../middlware";
import { streamSSE } from "hono/streaming";
import { z } from "zod";

export const aiChatRoute = new Hono();

const askSchema = z.object({
  question: z.string(),
  sessionId: z.string().optional(),
});

aiChatRoute.post("/", summaraizeServices, async (c) => {
  return streamSSE(
    c,
    async (s) => {
      // Set of messages to create vector embeddings on
      const data = await c.req.json();
      const clerk = c.get("clerkAuth");
      const userId = clerk?.userId;

      if (!userId) {
        throw new Error("Unauthorized");
      }

      const response = askSchema.safeParse(data);

      if (!response.success) {
        throw new Error("Invalid request", {
          cause: response.error.issues,
        });
      }

      const { question, sessionId } = response.data;

      const xata = c.get("xata");

      const resp = await xata.db.Summary.ask(question, {
        rules: [
          "Do not answer any questions unrelated to the users summaries.",
          "When you give an example, this example must exist exactly in the context given.",
          'Only answer questions that are relating to the defined context. If asked about a question outside of the context, you can respond with "I can only answer questions about the summaries you have requested silly! 😜"',
          "Your name is Sandra, and you are a bot. But the best bot ever! 🤖",
        ],
        sessionId,
        searchType: "vector",
        vectorSearch: {
          column: "embedding",
          contentColumn: "summary",
          filter: {
            user_id: userId as string,
          },
        },
      });

      await s.writeSSE({
        event: "message",
        data: JSON.stringify(resp),
        id: resp.sessionId,
        retry: 1000,
      });
    },
    async (err, stream) => {
      console.error(err);
      await stream.writeSSE({
        event: "error",
        data: JSON.stringify(err),
      });
    }
  );
});
