// shoutout https://github.com/xataio/examples/blob/main/apps/sample-chatgpt/src/pages/index.tsx#L27 💋

import { useCallback, useState } from "react";
import {
  fetchEventSource,
  type EventSourceMessage,
} from "@microsoft/fetch-event-source";
import { getBaseUrl } from "~lib/trpc/react";
import { getAuthToken } from "~lib/trpc/vanilla-client";
import type { AskResult } from "@summaraize/xata";
import { useQuery } from "@tanstack/react-query";

export const useAskXataDocs = () => {
  const { data: token } = useQuery({
    queryKey: ["token"],
    queryFn: getAuthToken,
  });
  const [docState, setDocState] = useState<{
    answer: string;
    loading: boolean;
    sessionId?: string;
  }>({
    answer: "",
    loading: false,
  });

  const askQuestion = useCallback(
    (question: string, sessionId?: string) => {
      if (!question) return;
      setDocState({
        answer: "",
        loading: true,
        sessionId,
      });

      void fetchEventSource(`${getBaseUrl()}/api/chat`, {
        method: "POST",
        body: JSON.stringify({ question, sessionId }),
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },

        onmessage(ev: EventSourceMessage) {
          try {
            const {
              answer = "",
              done,
              sessionId,
            } = JSON.parse(ev.data) as AskResult & {
              done: boolean;
            };
            setDocState((prev) => ({
              ...prev,
              answer: prev.answer + answer,
              loading: !done,
              sessionId,
            }));
          } catch (e) {
            console.warn(e);
          }
        },
      });
    },
    [token]
  );

  // Clear answer function
  const clearAnswer = useCallback(() => {
    setDocState({
      answer: "",
      loading: false,
      sessionId: undefined,
    });
  }, []);

  return {
    isLoading: docState.loading,
    answer: docState.answer,
    askQuestion,
    clearAnswer,
  };
};
