import "@fontsource/public-sans/300.css";
import "@fontsource/public-sans/400.css";
import "@fontsource/public-sans/500.css";
import "@fontsource/public-sans/700.css";
import { ClerkProvider } from "@clerk/chrome-extension";
import type {
  PlasmoCreateShadowRoot,
  PlasmoCSConfig,
  PlasmoMountShadowHost,
} from "plasmo";
import { MemoryRouter, useNavigate } from "react-router-dom";

import { SummaraizeSheet } from "~views/summary/sheet";

import createCache from "@emotion/cache";
import { CacheProvider } from "@emotion/react";
import type { PlasmoGetStyle } from "plasmo";
import { createTheme, ThemeProvider, type Theme } from "@mui/material";

import { createSummaraizeTheme } from "~theme";
import { TRPCReactProvider } from "~lib/trpc/react";
import { PusherProvider } from "~providers/pusher";
import { ToasterBoi } from "~components/toaster";
import { getSystemTheme } from "~utils";

export const config: PlasmoCSConfig = {
  matches: ["https://youtube.com/*", "https://www.youtube.com/*"],
  all_frames: false,
};

export const getShadowHostId = () => "summaraize-slider";

const styleElement = document.createElement("style");

const styleCache = createCache({
  key: "plasmo-emotion-cache",
  prepend: true,
  container: styleElement,
});

export const getStyle: PlasmoGetStyle = () => styleElement;

/**
 * @description Mount the shadow host and take a reference to the container so we can mount overlays etc in app
 */
let container: Element | null = null;
let theme: Theme | null = null;
export const mountShadowHost: PlasmoMountShadowHost = ({
  shadowHost,
  anchor,
}) => {
  anchor?.element.appendChild(shadowHost);
  container = shadowHost;
  theme = createSummaraizeTheme({
    components: {
      MuiPopover: {
        defaultProps: {
          container: shadowHost,
        },
      },
      MuiPopper: {
        defaultProps: {
          container: shadowHost,
        },
      },
      MuiModal: {
        defaultProps: {
          container: shadowHost,
        },
      },
    },
  });
};

export const createShadowRoot: PlasmoCreateShadowRoot = (shadowHost) =>
  shadowHost.attachShadow({ mode: "open" });

function SummaraizeExtension() {
  const navigate = useNavigate();
  return (
    <ClerkProvider
      publishableKey={process.env.PLASMO_PUBLIC_CLERK_PUBLISHABLE_KEY || ""}
      routerPush={(to) => navigate(to)}
      routerReplace={(to) => navigate(to, { replace: true })}
    >
      <TRPCReactProvider>
        <SummaraizeSheet shadowHost={container} />
      </TRPCReactProvider>
    </ClerkProvider>
  );
}

export default function Summary() {
  const systemTheme = getSystemTheme();
  const theme = createSummaraizeTheme({}, systemTheme) ?? createTheme();
  return (
    <CacheProvider value={styleCache}>
      <ThemeProvider theme={theme || createTheme()}>
        <MemoryRouter>
          {/* <PusherProvider> */}
          <SummaraizeExtension />
          <ToasterBoi />
          {/* </PusherProvider> */}
        </MemoryRouter>
      </ThemeProvider>
    </CacheProvider>
  );
}
