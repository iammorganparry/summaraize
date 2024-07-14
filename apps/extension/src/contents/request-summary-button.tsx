import { CacheProvider, ThemeProvider } from "@emotion/react";
import { CircularProgress, createTheme } from "@mui/material";
import type {
  PlasmoCSConfig,
  PlasmoGetInlineAnchor,
  PlasmoGetStyle,
} from "plasmo";
import { createSummaraizeTheme } from "~theme";
import createCache from "@emotion/cache";
import { AlertCircle, Eye, Stars01, XClose } from "@untitled-ui/icons-react";
import { getSystemTheme, removeExtraParams } from "~utils";
import { createToastMessage, openFlyout } from "~api/messages";
import { useCallback, useState } from "react";
import { useObserver } from "~lib/hooks/useObserver";
import { getYoutuveVideoId } from "~lib/utils";
import { client, getAuthToken } from "~lib/trpc/vanilla-client";
import { ContainedButton, OutlinedButton } from "~components/buttons/outlined";
import {
  QueryClientProvider,
  useMutation,
  useQuery,
} from "@tanstack/react-query";
import { createQueryClient } from "~lib/trpc/query-client";
import { useBackgroundMessages } from "~lib/messages/hooks";
import { useGetUser } from "~lib/hooks/useGetUser";
import { useWebsocketEvents } from "~lib/hooks/useWebsocketEvents";
import { SummaraizeThemeProvider } from "~providers/theme";
import { useGetAuthToken } from "~lib/hooks/useGetAuthToken";

export const config: PlasmoCSConfig = {
  matches: ["https://youtube.com/*", "https://www.youtube.com/*"],
};

export const getInlineAnchor = async () => ({
  element: document.querySelector("#chat-container"),
  insertPosition: "beforebegin",
});

const styleElement = document.createElement("style");

const styleCache = createCache({
  key: "plasmo-emotion-cache",
  prepend: true,
  container: styleElement,
});

export const getShadowHostId = () => "summaraize-request-summary-button";

export const getStyle: PlasmoGetStyle = () => styleElement;

const MAX_VIDEO_LENGTH_IN_MINUTES = 15; // TODO: should be server side

function RequestSummaryButton() {
  const [{ requested, videoToLong, progress }, setState] = useState({
    progress: 0,
    requested: false,
    videoToLong: true,
  });

  const { data: token } = useGetAuthToken();

  const { data: user } = useGetUser({ disabled: !token });

  const isOutOfRequests = user?.requestsRemaining === 0;

  const {
    data: summary,
    refetch,
    isLoading,
  } = useQuery({
    enabled: !!token,
    refetchOnWindowFocus: true,
    queryKey: ["summary", window.location.href],
    queryFn: () =>
      client.summary.getSummaryByVideoUrl.query({
        url: removeExtraParams(window.location.href),
      }),
  });
  const {
    data: summaryRequest,
    refetch: refetchSummaryRequest,
    isLoading: isLoadingRequestSummary,
  } = useQuery({
    enabled: !!token,
    queryKey: ["summary-request", window.location.href],
    queryFn: () =>
      client.summary.getSummaryRequestByUrl.query({
        url: removeExtraParams(window.location.href),
      }),
    refetchOnWindowFocus: true,
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
        requestId: summaryRequest?.id as string,
      });
    },
    {
      onSuccess: () => {
        refetch();
        refetchSummaryRequest();
      },
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

  const refresh = useCallback(() => {
    resetState();
  }, [resetState]);

  const onTabChanged = useCallback(() => {
    refresh();
  }, [refresh]);

  useBackgroundMessages({
    onTabChanged: onTabChanged,
  });

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

  const handleNavigateToSummary = () => {
    if (!summary?.video_url) {
      return;
    }
    openFlyout(`/summary/${encodeURIComponent(summary?.video_url)}`);
  };

  useWebsocketEvents({
    onSummaryCompleted: refresh,
    onSummaryProgress: setProgressFromWS,
  });

  if (summary || summaryRequest?.stage === "DONE") {
    return (
      <OutlinedButton
        variant="outlined"
        endIcon={<Eye />}
        fullWidth
        onClick={handleNavigateToSummary}
      >
        View summary
      </OutlinedButton>
    );
  }

  if (isOutOfRequests) {
    return (
      <ContainedButton disabled variant="contained" fullWidth>
        Out of requests (5 per day)
      </ContainedButton>
    );
  }

  if (isLoading || isLoadingRequestSummary) {
    return (
      <ContainedButton disabled variant="contained" fullWidth>
        <CircularProgress
          size="14px"
          sx={{
            color: (theme) => theme.palette.common.white,
          }}
        />
      </ContainedButton>
    );
  }

  if (requested || summaryRequest?.stage === "DOWNLOADING") {
    return (
      <>
        <OutlinedButton
          fullWidth
          sx={{
            mb: 5,
            // fill up the background based on progress
            background: (theme) =>
              `linear-gradient(to right, ${theme.palette.primary.main} ${progress}%, ${theme.palette.action.disabled} ${progress}%)
            `,
            transition: "background 0.5s",
          }}
          onClick={handleCancelRequest}
          endIcon={<XClose />}
          variant="outlined"
        >
          Cancel summary
        </OutlinedButton>
      </>
    );
  }

  if (videoToLong) {
    return (
      <OutlinedButton
        disabled
        endIcon={<AlertCircle />}
        variant="outlined"
        fullWidth
        sx={{
          mb: 5,
        }}
      >
        Too long to summarize
      </OutlinedButton>
    );
  }

  return (
    <ContainedButton
      fullWidth
      onClick={handleRequestSummary}
      variant="contained"
      sx={{
        mb: 5,
      }}
    >
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
      Request Summary ({user?.requestsRemaining} / 5)
    </ContainedButton>
  );
}

export default function RequestButton() {
  const [queryClient] = useState(createQueryClient());
  return (
    <QueryClientProvider client={queryClient}>
      <CacheProvider value={styleCache}>
        <SummaraizeThemeProvider>
          <RequestSummaryButton />
        </SummaraizeThemeProvider>
      </CacheProvider>
    </QueryClientProvider>
  );
}
