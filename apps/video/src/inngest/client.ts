import { EventSchemas, Inngest } from "inngest";
import { servicesMiddleware } from "./middleware";
import type { AppEventsType } from "./schema/app";
import type { ClerkEvents } from "./schema/clerk";
// Create a client to send and receive events

export const inngest = new Inngest({
  id: "summaraize-video",
  middleware: [servicesMiddleware],
  schemas: new EventSchemas().fromRecord<AppEventsType & ClerkEvents>(),
});
