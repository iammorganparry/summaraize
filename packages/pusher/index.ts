import PusherServer from "pusher";

export enum PusherEvents {
  SummaryCreated = "summary.created",
  SummaryCompleted = "summary.completed",
  SummaryProgressVideo = "summary.progress.video",
  SummaryProgressAudio = "summary.progress.audio",
}

export const pusher = new PusherServer({
  appId: process.env.PLASMO_PUBLIC_PUSHER_APP_ID ?? "",
  key: process.env.PLASMO_PUBLIC_PUSHER_APP_KEY ?? "",
  secret: process.env.PUSHER_APP_SECRET ?? "",
  cluster: "eu",
});
