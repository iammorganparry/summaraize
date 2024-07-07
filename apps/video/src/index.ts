import { serve as inngestServe } from "inngest/hono";
import { serve } from "@hono/node-server";

import { clerkMiddleware, getAuth } from "@hono/clerk-auth";

import { inngest } from "./inngest/client";
import { transcribeVideo } from "./inngest/app/transcribe-video";

import { Hono } from "hono";
import dotenv from "dotenv";

console.log("Starting video app...", {
	env: process.env.OPENAI_API_KEY,
});

const app = new Hono();
const port = 3001;

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
