import { CacheProvider, ThemeProvider } from "@emotion/react";
import { Button, CircularProgress, createTheme } from "@mui/material";
import type { PlasmoCSConfig, PlasmoGetStyle } from "plasmo";
import { createSummaraizeTheme } from "~theme";
import createCache from "@emotion/cache";
import { Stars01 } from "@untitled-ui/icons-react";
import { getSystemTheme, sleep } from "~utils";
import { createToastMessage } from "~api/messages";
import { ClerkProvider } from "@clerk/chrome-extension";
import { TRPCReactProvider, api } from "~lib/trpc/react";

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
  const { data: summary, isPending: loading } =
    api.summary.requestSummary.useMutation();
  const systemTheme = getSystemTheme();
  const theme = createSummaraizeTheme({}, systemTheme) ?? createTheme();
  const handleRequestSummary = async () => {
    await sleep(3000);
    createToastMessage(
      "Scheduled request summary, check back in a few moments after a tasty beverage. 🍺",
      "success"
    );
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
          {loading ? <CircularProgress /> : <Stars01 />}
          Request Summary
        </Button>
      </ThemeProvider>
    </CacheProvider>
  );
}

export default function RequestButton() {
  return (
    <ClerkProvider
      publishableKey={process.env.PLASMO_PUBLIC_CLERK_PUBLISHABLE_KEY || ""}
    >
      <TRPCReactProvider>
        <RequestSummaryButton />
      </TRPCReactProvider>
    </ClerkProvider>
  );
}
