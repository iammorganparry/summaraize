import { createTRPCProxyClient, httpBatchLink } from "@trpc/client";
import type { AppRouter } from "@summaraize/trpc";
import SuperJSON from "superjson";
import { getBaseUrl } from "./react";
import { storage } from "~lib/storage/client";

export const client = createTRPCProxyClient<AppRouter>({
  transformer: SuperJSON,
  links: [
    httpBatchLink({
      url: `${getBaseUrl()}/api/trpc`,
      // You can pass any HTTP headers you wish here
      async headers() {
        const token = await storage.get("clerk-token"); // "value"
        console.log("Got Token", token);
        return {
          authorization: token ? `Bearer ${token}` : "",
        };
      },
    }),
  ],
});
