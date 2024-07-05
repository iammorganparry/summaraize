import { EventSchemas, Inngest } from "inngest";
import { servicesMiddleware } from "./middleware";
import type { AIEvents } from "./schema/ai";
// Create a client to send and receive events

export const inngest = new Inngest({
	id: "summaraize",
	middleware: [servicesMiddleware],
	schemas: new EventSchemas().fromRecord<AIEvents>(),
});
