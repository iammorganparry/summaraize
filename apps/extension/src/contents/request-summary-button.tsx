import { CacheProvider, ThemeProvider } from "@emotion/react";
import { Button, CircularProgress, createTheme } from "@mui/material";
import type { PlasmoCSConfig, PlasmoGetStyle } from "plasmo";
import { createSummaraizeTheme } from "~theme";
import createCache from "@emotion/cache";
import { Stars01 } from "@untitled-ui/icons-react";
import { getSystemTheme, sleep } from "~utils";
import { createToastMessage } from "~api/messages";
import { useCallback, useEffect, useState } from "react";
import { sendToBackground } from "@plasmohq/messaging";
import type {
  RequestBody,
  ResponseBody,
} from "~background/messages/request-summary";

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

function RequestSummaryButton() {
  const [loading, setLoading] = useState(false);
  const systemTheme = getSystemTheme();
  const theme = createSummaraizeTheme({}, systemTheme) ?? createTheme();
  const handleRequestSummary = async () => {
    setLoading(true);
    const resp = await sendToBackground<RequestBody, ResponseBody>({
      name: "request-summary",
      body: {
        videoId: "123",
      },
    });

    if (resp.errors) {
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
  };

  return (
    <CacheProvider value={styleCache}>
      <ThemeProvider theme={theme}>
        <Button
          onClick={handleRequestSummary}
          variant="contained"
          sx={{
            mx: 2,
            fontWeight: 600,
            fontSize: 12,
            boxShadow: (theme) => theme.shadows[0],
            zIndex: 3,
            gap: 1,
            width: 200,
            "&:hover": {
              boxShadow: (theme) => theme.shadows[3],
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
      </ThemeProvider>
    </CacheProvider>
  );
}

export default function RequestButton() {
  return <RequestSummaryButton />;
}
