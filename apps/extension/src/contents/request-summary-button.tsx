import { CacheProvider, ThemeProvider } from "@emotion/react";
import { Chip, CircularProgress, createTheme } from "@mui/material";
import type {
  PlasmoCSConfig,
  PlasmoGetInlineAnchor,
  PlasmoGetStyle,
} from "plasmo";
import { createSummaraizeTheme } from "~theme";
import createCache from "@emotion/cache";
import { AlertCircle, Eye, Stars01, XClose } from "@untitled-ui/icons-react";
import { getSystemTheme } from "~utils";
import { createToastMessage } from "~api/messages";
import { useCallback, useEffect, useRef, useState } from "react";
import { useObserver } from "~lib/hooks/useObserver";
import { getYoutuveVideoId } from "~lib/utils";
import { client } from "~lib/trpc/vanilla-client";
import { ContainedButton, OutlinedButton } from "~components/buttons/outlined";
import {
  QueryClientProvider,
  useMutation,
  useQuery,
} from "@tanstack/react-query";
import { createQueryClient } from "~lib/trpc/query-client";
import { pusher } from "~lib/socket/pusher";
import { getClerkJs } from "~lib/clerk/vanilla";
import type { Channel } from "pusher-js";
import { PusherEvents } from "@summaraize/pusher";

export const config: PlasmoCSConfig = {
  matches: ["https://youtube.com/*", "https://www.youtube.com/*"],
};

export const getInlineAnchor = async () => ({
  element: document.querySelector("#content #container"),
  insertPosition: "afterbegin",
});

const styleElement = document.createElement("style");

const styleCache = createCache({
  key: "plasmo-emotion-cache",
  prepend: true,
  container: styleElement,
});

export const getShadowHostId = () => "summaraize-request-summary-button";

export const getStyle: PlasmoGetStyle = () => styleElement;

const MAX_VIDEO_LENGTH_IN_MINUTES = 15;

function RequestSummaryButton() {
  const [{ requested, videoToLong, progress }, setState] = useState({
    progress: 0,
    requested: false,
    videoToLong: true,
  });

  const { data: clerk } = useQuery({
    queryKey: ["clerk"],
    queryFn: () => getClerkJs(),
  });

  const channel = useRef<Channel | null>(null);
  useEffect(() => {
    if (clerk) {
      channel.current = pusher.subscribe(`private-${clerk.user?.id}`);
    }
  }, [clerk]);

  const { data: summary, refetch } = useQuery({
    queryKey: ["summary", window.location.href],
    queryFn: () =>
      client.summary.getSummaryByVideoUrl.query({ url: window.location.href }),
  });
  const { data: summaryRequest, refetch: refetchSummaryRequest } = useQuery({
    queryKey: ["summary-request", window.location.href],
    queryFn: () =>
      client.summary.getSummaryRequestByUrl.query({
        url: window.location.href,
      }),
  });

  const { mutateAsync: requestSummary, isLoading: loading } = useMutation(
    ["summary", window.location.href],
    () => {
      return client.summary.requestSummary.mutate({
        src: window.location.href,
        videoId: getYoutuveVideoId(window.location.href) as string,
      });
    }
  );
  const { mutateAsync: cancelSummary } = useMutation(
    ["cancel-summary", window.location.href],
    () => {
      return client.summary.cancelSummary.mutate({
        src: window.location.href,
        videoId: getYoutuveVideoId(window.location.href) as string,
      });
    }
  );

  useObserver(
    {
      childList: true,
      subtree: true,
    },
    (_, observer) => {
      const video = document.querySelector<HTMLVideoElement>(
        "#player-container video"
      );
      if (video?.duration) {
        const minutes = video.duration / 60;
        setState((prev) => ({
          ...prev,
          videoToLong: minutes > MAX_VIDEO_LENGTH_IN_MINUTES,
        }));
        observer.disconnect();
      }
    }
  );

  const handleRequestSummary = async () => {
    try {
      const videoId = getYoutuveVideoId(window.location.href);
      if (!videoId) {
        createToastMessage(
          "Failed to get video ID, please try again. 🙁",
          "error"
        );
        return;
      }

      const resp = await requestSummary();

      if (!resp.ids) {
        createToastMessage(
          "Failed to schedule request summary, please try again. 🙁",
          "error"
        );
        return;
      }

      createToastMessage(
        "Scheduled request summary, check back in a few moments after a tasty beverage. 🍺",
        "success"
      );
      setState((prev) => ({
        ...prev,
        requested: true,
      }));
    } catch (error) {
      createToastMessage(
        "Failed to schedule request summary, please try again. 🙁",
        "error"
      );
    }
  };

  const handleCancelRequest = async () => {
    const videoId = getYoutuveVideoId(window.location.href);

    if (!videoId) {
      createToastMessage(
        "Failed to get video ID, please try again. 🙁",
        "error"
      );
      return;
    }

    const resp = await cancelSummary();

    if (!resp.ids) {
      createToastMessage(
        "Failed to cancel request summary, please try again. 🙁",
        "error"
      );
      return;
    }

    createToastMessage(
      "Canceled request summary, you can request again. 😉",
      "success"
    );
    setState((prev) => ({
      ...prev,
      requested: false,
    }));
  };

  const resetState = useCallback(async () => {
    setState({
      progress: 0,
      requested: false,
      videoToLong: true,
    });
    await refetch();
    await refetchSummaryRequest();
  }, [refetch, refetchSummaryRequest]);

  // const handleTabChange = useCallback(() => {
  //   chrome.tabs.onUpdated.addListener((_, changeInfo, __) => {
  //     if (changeInfo.status === "complete") {
  //       resetState();
  //     }
  //   });
  // }, [resetState]);

  // useEffect(() => {
  //   handleTabChange();
  // }, [handleTabChange]);

  const refresh = useCallback(() => {
    resetState();
  }, [resetState]);

  const setProgressFromWS = useCallback(
    (data: { progress: number }) => {
      if (data.progress === 100) {
        return refresh();
      }
      setState((prev) => ({
        ...prev,
        progress: data.progress,
      }));
    },
    [refresh]
  );

  useEffect(() => {
    channel.current?.bind(PusherEvents.SummaryProgressVideo, setProgressFromWS);
    channel.current?.bind(PusherEvents.SummaryCompleted, refresh);
    return () => {
      channel.current?.unbind_all();
    };
  }, [refresh, setProgressFromWS]);

  if (summary) {
    return (
      <OutlinedButton variant="outlined" endIcon={<Eye />}>
        View summary
      </OutlinedButton>
    );
  }

  if (requested || summaryRequest) {
    return (
      <>
        <OutlinedButton
          sx={{
            // fill up the background based on progress
            background: (theme) =>
              `linear-gradient(to right, ${theme.palette.primary.main} ${progress}%, ${theme.palette.action.disabled} ${progress}%)
            `,
            transition: "background 0.5s",
          }}
          onClick={handleCancelRequest}
          endIcon={<XClose />}
          startIcon={<Chip label={`${summaryRequest?.stage}%`} />}
          variant="outlined"
        >
          Cancel summary
        </OutlinedButton>
      </>
    );
  }

  if (videoToLong) {
    return (
      <OutlinedButton disabled endIcon={<AlertCircle />} variant="outlined">
        Too long to summarize
      </OutlinedButton>
    );
  }

  return (
    <ContainedButton onClick={handleRequestSummary} variant="contained">
      {loading ? (
        <CircularProgress
          size="14px"
          sx={{
            color: (theme) => theme.palette.common.white,
          }}
        />
      ) : (
        <Stars01 />
      )}
      Request Summary
    </ContainedButton>
  );
}

export default function RequestButton() {
  const [queryClient] = useState(createQueryClient());
  const systemTheme = getSystemTheme();
  const theme = createSummaraizeTheme({}, systemTheme) ?? createTheme();
  return (
    <QueryClientProvider client={queryClient}>
      <CacheProvider value={styleCache}>
        <ThemeProvider theme={theme}>
          <RequestSummaryButton />
        </ThemeProvider>
      </CacheProvider>
    </QueryClientProvider>
  );
}
