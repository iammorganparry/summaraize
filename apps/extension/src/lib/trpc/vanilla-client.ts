import { createTRPCProxyClient, httpBatchLink } from "@trpc/client";
import type { AppRouter } from "@thatrundown/trpc";
import SuperJSON from "superjson";
import { getBaseUrl } from "./react";
import { Clerk } from "@clerk/clerk-js/headless";

export async function getAuthToken() {
  const clerk = new Clerk(
    process.env.PLASMO_PUBLIC_CLERK_PUBLISHABLE_KEY as string
  );
  await clerk.load();
  return (await clerk.session?.getToken()) ?? null;
}

export const client = createTRPCProxyClient<AppRouter>({
  transformer: SuperJSON,
  links: [
    httpBatchLink({
      url: `${getBaseUrl()}/api/trpc`,
      // You can pass any HTTP headers you wish here
      async headers() {
        try {
          const token = await getAuthToken();
          // const token = await storage.get("clerk-token"); // "value"
          console.log("Got Token", token);
          return {
            authorization: token ? `Bearer ${token}` : "",
          };
        } catch (error) {
          console.error("Error getting token", error);
          return {};
        }
      },
    }),
  ],
});
