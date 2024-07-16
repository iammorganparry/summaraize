import PusherServer from "pusher";
import { config } from "dotenv";

config({
  path: "../../.env",
});

export enum PusherEvents {
  SummaryCreated = "summary.created",
  SummaryCompleted = "summary.completed",
  SummaryProgressVideo = "summary.progress.video",
  SummaryProgressAudio = "summary.progress.audio",
  SummaryStep = "summary.step",
  SummaryError = "summary.error",
}

let pusherSingleton: PusherServer | null = null;

export const getPusherServer = () => {
  if (pusherSingleton) {
    return pusherSingleton;
  }

  console.log("Creating new pusher server", {
    secret: process.env.PUSHER_APP_SECRET,
    appId: process.env.PLASMO_PUBLIC_PUSHER_APP_ID,
    key: process.env.PLASMO_PUBLIC_PUSHER_APP_KEY,
  });

  return (pusherSingleton = new PusherServer({
    appId: process.env.PLASMO_PUBLIC_PUSHER_APP_ID ?? "",
    key: process.env.PLASMO_PUBLIC_PUSHER_APP_KEY ?? "",
    secret: process.env.PUSHER_APP_SECRET ?? "",
    cluster: "eu",
    useTLS: true,
  }));
};

export const pusher = getPusherServer();
