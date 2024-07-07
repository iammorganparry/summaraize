// src/app/api/inngest/route.ts
import { serve } from "inngest/next";
import { transcribeVideo } from "~/app/inngest/ai/transcribe-video";
import { inngest } from "~/app/inngest/client";

export const { GET, POST, PUT } = serve({
	client: inngest,
	functions: [
		transcribeVideo,
		/* your functions will be passed here later! */
	],
	streaming: "allow",
});
