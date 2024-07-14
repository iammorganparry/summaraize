import { serve as inngestServe } from "inngest/hono";
import { serve } from "@hono/node-server";

import { clerkMiddleware, getAuth } from "@hono/clerk-auth";

import { inngest } from "./inngest/client";
import { cancelSummary, transcribeVideo } from "./inngest/app/transcribe-video";

import { Hono } from "hono";
import { trpcServer } from "@hono/trpc-server";
import { appRouter } from "@summaraize/trpc";
import { createTRPCContext } from "@summaraize/trpc/trpc";
import dotenv from "dotenv";
import { cors } from "hono/cors";
import { logger as honorLogger } from "hono/logger";
import { pusherAuthRoute } from "./routes/pusher";
import { summaraizeServices } from "./middlware";
import { aiChatRoute } from "./routes/chat";

dotenv.config({
  path: "../../.env",
});

console.log("Starting video app...", {
  env: process.env.OPENAI_API_KEY,
});

export const app = new Hono();
const port = 3001;

app.use(honorLogger());
app.use("*", clerkMiddleware());
app.use(
  "*",
  cors({
    origin: "*",
  })
);

app.use("/api/*", summaraizeServices);

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

app.route("api/pusher/auth", pusherAuthRoute);
app.route("api/chat", aiChatRoute);

app.on(["GET", "PUT", "POST"], "/api/inngest", (c) => {
  const handler = inngestServe({
    client: inngest,
    functions: [transcribeVideo, cancelSummary],
    signingKey: process.env.INNGEST_SIGNING_KEY,
  });
  return handler(c);
});

serve({
  fetch: app.fetch,
  port,
});

export type { inngest };
