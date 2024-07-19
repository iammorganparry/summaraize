import { getBaseUrl, getQueryClient } from "~lib/trpc/react";
import { EventSourcePolyfill } from "event-source-polyfill";
import { z } from "zod";

const answerSchema = z.object({
  answer: z.string(),
  done: z.boolean(),
});

export const getEventStreamContent =
  (token: string) =>
  ({ queryKey }: { queryKey: string[] }) => {
    return new Promise((resolve, reject) => {
      const [_key] = queryKey;
      const queryClient = getQueryClient();
      const eventSource = new EventSourcePolyfill(`${getBaseUrl()}/api/chat`, {
        withCredentials: true,
        headers: {
          Authorization: `Bearer ${token}`,
        },

        heartbeatTimeout: 60000, //Timeout
      });
      eventSource.addEventListener("SUCCESS", (e) => {
        // @ts-expect-error
        const data = answerSchema.safeParse(JSON.parse(e.data));
        if (data.error) {
          console.error(data.error);
          reject(data.error);
        }

        if (data.data?.done) {
          eventSource.close();
          queryClient.setQueryData([_key], data.data);
          resolve(data.data); // Resolve promise with data
        } else {
          if (data) {
            queryClient.setQueryData([_key], data);
          }
        }
      });
      eventSource.addEventListener("error", (e) => {
        eventSource.close();
        reject(e); // Reject promise with error
      });
    });
  };
