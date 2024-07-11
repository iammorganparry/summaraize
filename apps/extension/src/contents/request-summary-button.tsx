import { CacheProvider, ThemeProvider } from "@emotion/react";
import { CircularProgress, createTheme } from "@mui/material";
import type { PlasmoCSConfig, PlasmoGetStyle } from "plasmo";
import { createSummaraizeTheme } from "~theme";
import createCache from "@emotion/cache";
import { AlertCircle, Eye, Stars01, XClose } from "@untitled-ui/icons-react";
import { getSystemTheme } from "~utils";
import { createToastMessage } from "~api/messages";
import { useCallback, useEffect, useState } from "react";
import { useObserver } from "~lib/hooks/useObserver";
import { getYoutuveVideoId } from "~lib/utils";
import { client } from "~lib/trpc/vanilla-client";
import type { Summary } from "@summaraize/prisma";
import { ContainedButton, OutlinedButton } from "~components/buttons/outlined";

export const config: PlasmoCSConfig = {
  matches: ["https://youtube.com/*", "https://www.youtube.com/*"],
};

export const getInlineAnchor = async () => ({
  element: document.querySelector("#owner"),
  insertPosition: "beforeend",
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
  const [loading, setLoading] = useState(false);
  const [summary, setSummary] = useState<Summary | null>(null);
  const [requested, setRequested] = useState(false);
  const [videoToLong, setVideoToLong] = useState(true);
  useObserver(
    {
      childList: true,
      subtree: true,
    },
    (mutations, observer) => {
      console.log(
        "mutation observer",
        document.querySelector<HTMLVideoElement>("#player-container video")
          ?.duration
      );

      const video = document.querySelector<HTMLVideoElement>(
        "#player-container video"
      );
      if (video?.duration) {
        console.log("video duration", video.duration);
        const minutes = video.duration / 60;
        setVideoToLong(minutes > MAX_VIDEO_LENGTH_IN_MINUTES);
        observer.disconnect();
      }
    }
  );

  const handleRequestSummary = async () => {
    try {
      setLoading(true);
      const videoId = getYoutuveVideoId(window.location.href);

      if (!videoId) {
        createToastMessage(
          "Failed to get video ID, please try again. 🙁",
          "error"
        );
        setLoading(false);
        return;
      }

      const resp = await client.summary.requestSummary.mutate({
        src: window.location.href,
        videoId,
      });

      if (!resp.ids) {
        createToastMessage(
          "Failed to schedule request summary, please try again. 🙁",
          "error"
        );
        setLoading(false);
        return;
      }

      createToastMessage(
        "Scheduled request summary, check back in a few moments after a tasty beverage. 🍺",
        "success"
      );
      setLoading(false);
      setRequested(true);
    } catch (error) {
      createToastMessage(
        "Failed to schedule request summary, please try again. 🙁",
        "error"
      );
      setLoading(false);
    }
  };

  const handleCancelRequest = async () => {
    setLoading(true);
    const videoId = getYoutuveVideoId(window.location.href);

    if (!videoId) {
      createToastMessage(
        "Failed to get video ID, please try again. 🙁",
        "error"
      );
      setLoading(false);
      return;
    }

    const resp = await client.summary.cancelSummary.mutate({
      src: window.location.href,
      videoId,
    });

    if (!resp.ids) {
      createToastMessage(
        "Failed to cancel request summary, please try again. 🙁",
        "error"
      );
      setLoading(false);
      return;
    }

    createToastMessage(
      "Canceled request summary, you can request again. 😉",
      "success"
    );
    setLoading(false);
    setRequested(false);
  };

  const handleCheckForSummary = useCallback(async () => {
    const resp = await client.summary.getSummaryByVideoUrl.query({
      url: window.location.href,
    });
    if (resp) {
      setSummary(resp);
    }
  }, []);

  const resetState = useCallback(async () => {
    setSummary(null);
    setRequested(false);
    setVideoToLong(false);
    await handleCheckForSummary();
  }, [handleCheckForSummary]);

  const handleTabChange = useCallback(() => {
    chrome.tabs.onUpdated.addListener((_, changeInfo, __) => {
      if (changeInfo.status === "complete") {
        resetState();
      }
    });
  }, [resetState]);

  useEffect(() => {
    handleTabChange();
  }, [handleTabChange]);

  useEffect(() => {
    void handleCheckForSummary();
  }, [handleCheckForSummary]);

  if (summary) {
    return (
      <OutlinedButton variant="outlined" endIcon={<Eye />}>
        View summary
      </OutlinedButton>
    );
  }

  if (requested) {
    return (
      <>
        <OutlinedButton
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
  const systemTheme = getSystemTheme();
  const theme = createSummaraizeTheme({}, systemTheme) ?? createTheme();
  return (
    <CacheProvider value={styleCache}>
      <ThemeProvider theme={theme}>
        <RequestSummaryButton />
      </ThemeProvider>
    </CacheProvider>
  );
}
