import { QueryClientProvider, type QueryClient } from "@tanstack/react-query";
import { loggerLink, httpLink } from "@trpc/client";
import { createTRPCReact } from "@trpc/react-query";
import type { inferRouterInputs, inferRouterOutputs } from "@trpc/server";
import SuperJSON from "superjson";
import type { AppRouter } from "@thatrundown/trpc";
import { createQueryClient } from "./query-client";
import { useState } from "react";
import { useAuth } from "@clerk/chrome-extension";
import { storage } from "~lib/storage/client";

let clientQueryClientSingleton: QueryClient | undefined = undefined;
export const getQueryClient = () => {
  if (typeof window === "undefined") {
    // Server: always make a new query client
    return createQueryClient();
  }
  // Browser: use singleton pattern to keep the same query client
  return (clientQueryClientSingleton ??= createQueryClient());
};

export const api = createTRPCReact<AppRouter>();

/**
 * Inference helper for inputs.
 *
 * @example type HelloInput = RouterInputs['example']['hello']
 */
export type RouterInputs = inferRouterInputs<AppRouter>;

/**
 * Inference helper for outputs.
 *
 * @example type HelloOutput = RouterOutputs['example']['hello']
 */
export type RouterOutputs = inferRouterOutputs<AppRouter>;

export function TRPCReactProvider(props: { children: React.ReactNode }) {
  const queryClient = getQueryClient();
  const { getToken } = useAuth();

  const [trpcClient] = useState(() =>
    api.createClient({
      transformer: SuperJSON,
      links: [
        httpLink({
          url: `${getBaseUrl()}/api/trpc`,
          // You can pass any HTTP headers you wish here
          async headers() {
            const token = await getToken();
            // save it
            storage.set("clerk-token", token);
            return {
              authorization: token ? `Bearer ${token}` : "",
            };
          },
        }),

        loggerLink({
          enabled: (opts) =>
            process.env.NODE_ENV === "development" || (opts.direction === "down" && opts.result instanceof Error),
        }),
      ],
    }),
  );

  return (
    <QueryClientProvider client={queryClient}>
      <api.Provider client={trpcClient} queryClient={queryClient}>
        {props.children}
      </api.Provider>
    </QueryClientProvider>
  );
}

export function getBaseUrl() {
  if (process.env.PLASMO_PUBLIC_API_URL) {
    return process.env.PLASMO_PUBLIC_API_URL;
  }
  // return "http://localhost:3001";
}
