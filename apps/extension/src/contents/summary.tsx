import "@fontsource/public-sans/300.css";
import "@fontsource/public-sans/400.css";
import "@fontsource/public-sans/500.css";
import "@fontsource/public-sans/700.css";
import { ClerkProvider } from "@clerk/chrome-extension";
import type { PlasmoCreateShadowRoot, PlasmoCSConfig, PlasmoMountShadowHost } from "plasmo";
import { MemoryRouter, useNavigate } from "react-router-dom";

import { ThatRundownSheet } from "~views/summary/sheet";

import createCache from "@emotion/cache";
import { CacheProvider } from "@emotion/react";
import type { PlasmoGetStyle } from "plasmo";
import { TRPCReactProvider } from "~lib/trpc/react";
import { ToasterBoi } from "~components/toaster";

import { useCallback, useEffect, useState } from "react";
import { ThatRundownThemeProvider } from "~providers/theme";
import { PusherProvider } from "~providers/pusher";

export const config: PlasmoCSConfig = {
  matches: ["https://youtube.com/*", "https://www.youtube.com/*"],
  all_frames: false,
};

export const getShadowHostId = () => "thatrundown-slider";

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
export const mountShadowHost: PlasmoMountShadowHost = ({ shadowHost, anchor }) => {
  anchor?.element.appendChild(shadowHost);
  container = shadowHost;
};

export const createShadowRoot: PlasmoCreateShadowRoot = (shadowHost) => shadowHost.attachShadow({ mode: "open" });

function ThatRundownExtension() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const handleClose = () => {
    setOpen(false);
  };

  const handleOpen = useCallback(() => {
    setOpen(true);
  }, []);

  useEffect(() => {
    window.addEventListener("navigate.to.summary", (event) => {
      navigate(event.detail.path);
      handleOpen();
    });
    chrome.storage.sync.clear();
  }, [navigate, handleOpen]);

  return (
    <ClerkProvider
      publishableKey={process.env.PLASMO_PUBLIC_CLERK_PUBLISHABLE_KEY || ""}
      routerPush={(to) => navigate(to)}
      routerReplace={(to) => navigate(to, { replace: true })}
    >
      <TRPCReactProvider>
        <PusherProvider>
          <ThatRundownSheet shadowHost={container} open={open} onClose={handleClose} onOpen={handleOpen} />
        </PusherProvider>
      </TRPCReactProvider>
    </ClerkProvider>
  );
}

export default function TheRundown() {
  return (
    <CacheProvider value={styleCache}>
      <ThatRundownThemeProvider>
        <MemoryRouter>
          <ThatRundownExtension />
          <ToasterBoi />
        </MemoryRouter>
      </ThatRundownThemeProvider>
    </CacheProvider>
  );
}
