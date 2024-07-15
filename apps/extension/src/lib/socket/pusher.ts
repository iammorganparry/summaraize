import PusherClient from "pusher-js";
import { getAuthToken } from "~lib/trpc/vanilla-client";

let pusherSingleton: PusherClient | null = null;

export const getPusher = async () => {
  const authToken = await getAuthToken();
  if (pusherSingleton) {
    return pusherSingleton;
  }

  console.log("Creating new pusher client", {
    key: process.env.PLASMO_PUBLIC_PUSHER_APP_KEY,
  });

  return (pusherSingleton ??= new PusherClient(process.env.PLASMO_PUBLIC_PUSHER_APP_KEY as string, {
    cluster: "eu",
    authEndpoint: `${process.env.PLASMO_PUBLIC_API_URL}/api/pusher/auth`,
    channelAuthorization: {
      endpoint: `${process.env.PLASMO_PUBLIC_API_URL}/api/pusher/auth`,
      transport: "ajax",
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    },
  }));
};
