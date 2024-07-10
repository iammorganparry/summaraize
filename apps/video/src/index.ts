import { serve as inngestServe } from "inngest/hono";
import { serve } from "@hono/node-server";

import { clerkMiddleware, getAuth } from "@hono/clerk-auth";

import { inngest } from "./inngest/client";
import { transcribeVideo } from "./inngest/app/transcribe-video";

import { Hono } from "hono";
import { trpcServer } from "@hono/trpc-server";
import { appRouter } from "@summaraize/trpc";
import { createTRPCContext } from "@summaraize/trpc/trpc";
import dotenv from "dotenv";
import { cors } from "hono/cors";
import { logger } from "hono/logger";

dotenv.config({
  path: "../../.env",
});

console.log("Starting video app...", {
  env: process.env.OPENAI_API_KEY,
});

export const app = new Hono();
const port = 3001;

app.use(logger());
app.use("*", clerkMiddleware());
app.use("/api/*", cors());

app.use(
  "/api/trpc/*",
  trpcServer({
    endpoint: "/api/trpc",
    router: appRouter,
    createContext: (_opts, c) => {
      return createTRPCContext({ auth: getAuth(c), inngest });
    },
  })
);

app.get("/", (c) => {
  const auth = getAuth(c);
  if (!auth?.userId) {
    return c.json({
      message: "You are not logged in.",
    });
  }
  return c.json({
    message: "You are logged in! good job!",
    userId: auth.userId,
  });
});

app.on(["GET", "PUT", "POST"], "/api/inngest", (c) => {
  const handler = inngestServe({
    client: inngest,
    functions: [transcribeVideo],
    signingKey: process.env.INNGEST_SIGNING_KEY,
  });
  return handler(c);
});

serve({
  fetch: app.fetch,
  port,
});

export type { inngest };
