import { CacheProvider, ThemeProvider } from "@emotion/react";
import { Button, CircularProgress, createTheme } from "@mui/material";
import type { PlasmoCSConfig, PlasmoGetStyle } from "plasmo";
import { createSummaraizeTheme } from "~theme";
import createCache from "@emotion/cache";
import { AlertCircle, Stars01, XClose } from "@untitled-ui/icons-react";
import { getSystemTheme } from "~utils";
import { createToastMessage } from "~api/messages";
import { useState } from "react";
import { useObserver } from "~lib/hooks/useObserver";
import { getYoutuveVideoId } from "~lib/utils";
import { client } from "~lib/trpc/vanilla-client";

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
      if (video) {
        console.log("video duration", video.duration);
        const minutes = video.duration / 60;
        setVideoToLong(minutes > MAX_VIDEO_LENGTH_IN_MINUTES);
        observer.disconnect();
      }
    }
  );

  const handleRequestSummary = async () => {
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

  if (requested) {
    return (
      <>
        <Button
          onClick={handleCancelRequest}
          endIcon={<XClose />}
          variant="outlined"
          sx={{
            fontWeight: 600,
            fontSize: 12,
            opacity: 0.5,
            boxShadow: (theme) => theme.shadows[0],
            zIndex: 3,
            color: (theme) => theme.palette.common.white,
            gap: 1,
            mx: 2,
            "&:hover": {
              borderColor: (theme) => theme.palette.common.white,
              opacity: 1,
              boxShadow: (theme) => theme.shadows[2],
            },
          }}
        >
          Cancel summary
        </Button>
      </>
    );
  }

  if (videoToLong) {
    return (
      <Button
        disabled
        endIcon={<AlertCircle />}
        variant="outlined"
        sx={{
          mx: 2,
          display: "flex",
          alignItems: "center",
          gap: 1,
          width: 200,
        }}
      >
        Too long to summarize
      </Button>
    );
  }

  return (
    <Button
      onClick={handleRequestSummary}
      variant="contained"
      sx={{
        fontWeight: 600,
        fontSize: 12,
        boxShadow: (theme) => theme.shadows[0],
        zIndex: 3,
        gap: 1,
        mx: 2,
        "&:hover": {
          boxShadow: (theme) => theme.shadows[2],
        },
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
      Request Summary
    </Button>
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
