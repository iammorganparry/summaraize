import PusherServer from "pusher";
import { env } from "./env";

export enum PusherEvents {
  SummaryCreated = "summary-created",
}

export const pusher = new PusherServer({
  appId: env.PLASMO_PUBLIC_PUSHER_APP_ID,
  key: env.PLASMO_PUBLIC_PUSHER_APP_KEY,
  secret: env.PUSHER_APP_SECRET,
  cluster: "eu",
});
