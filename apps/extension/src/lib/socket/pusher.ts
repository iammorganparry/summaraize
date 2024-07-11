import PusherClient from "pusher-js";

export const pusher = new PusherClient(
  process.env.PLASMO_PUBLIC_PUSHER_KEY as string,
  {
    cluster: "eu",
    authEndpoint: `${process.env.PLASMO_PUBLIC_API_URL}/api/pusher/auth`,
    channelAuthorization: {
      endpoint: `${process.env.PLASMO_PUBLIC_API_URL}/api/pusher/auth`,
      transport: "ajax",
    },
  }
);
