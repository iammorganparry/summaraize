import { serve } from "inngest/hono";
import { clerkMiddleware, getAuth } from "@hono/clerk-auth";

import { inngest } from "./inngest/client";
import { transcribeVideo } from "./inngest/app/transcribe-video";

import { Hono } from "hono";

const app = new Hono();

app.use("*", clerkMiddleware());

app.get("/", (c) => {
  const auth = getAuth(c);

  if (!auth?.userId) {
    return c.json({
      message: "You are not logged in.",
    });
  }

  return c.json({
    message: "You are logged in!",
    userId: auth.userId,
  });
});

app.on(["GET", "PUT", "POST"], "/api/inngest", (c) => {
  const handler = serve({
    client: inngest,
    functions: [transcribeVideo],
    signingKey: process.env.INNGEST_SIGNING_KEY,
  });
  return handler(c);
});

export default {
  port: 3001,
  fetch: app.fetch,
};
