import { CacheProvider } from "@emotion/react";
import {
  Box,
  Dialog,
  DialogActions,
  DialogContent,
  Typography,
} from "@mui/material";
import type {
  PlasmoCSConfig,
  PlasmoGetStyle,
  PlasmoMountShadowHost,
} from "plasmo";
import createCache from "@emotion/cache";
import { ThatRundownThemeProvider } from "~providers/theme";
import { ShepherdJourneyProvider, useShepherd } from "react-shepherd";
import { OutlinedButton } from "~components/buttons/outlined";
import { useEffect, useState } from "react";
import { tourSteps } from "~lib/tour/steps";
import { Selectors } from "~views/summary/constants";
import { getSystemTheme } from "~utils";
import { useGetUser } from "~lib/hooks/useGetUser";
import { useGetAuthToken } from "~lib/hooks/useGetAuthToken";
import { createQueryClient } from "~lib/trpc/query-client";
import { QueryClientProvider } from "@tanstack/react-query";

export const config: PlasmoCSConfig = {
  matches: ["https://youtube.com/*", "https://www.youtube.com/*"],
  all_frames: false,
};

export const getShadowHostId = () => "thatrundown-onboarding-modal";

const styleElement = document.createElement("style");

const styleCache = createCache({
  key: "plasmo-emotion-cache",
  prepend: true,
  container: styleElement,
});

const tourOptions = {
  defaultStepOptions: {
    cancelIcon: {
      enabled: true,
    },
  },
  useModalOverlay: true,
};

const systemTheme = getSystemTheme();

export const getStyle: PlasmoGetStyle = () => {
  styleElement.textContent = `
    .shepherd-content {
      width: 400px;
      padding: 8px;
    }
    .shepherd-title {
      font-size: 24px;
    }
    .shepherd-text {
      font-size: 20px;
    }
      .shepherd-footer {
      justify-content: flex-end;
      display: flex;
      align-items: center;
      padding: 8px;
      gap: 16px;

}
      .shepherd-arrow {
      background: ${systemTheme === "dark" ? "#333" : "white"};
      color: ${systemTheme === "dark" ? "white" : "black"};
}
    .shepherd-element {
    box-shadow: 4px 6px 0px 0px ${systemTheme === "dark" ? "#fff" : "#000"};
    border: 3px solid ${systemTheme === "dark" ? "#fff" : "#000"};
    padding: 8px;
    color: ${systemTheme === "dark" ? "white" : "black"};
      background: ${systemTheme === "dark" ? "#333" : "white"};
    }
      .shepherd-button-secondary  {
      background-color: #FF4911;
      color: white;
      height: 30px;
      border: 2px solid white;
      outline: none;
      box-shadow: 3px 4px 0px 0px ${systemTheme === "dark" ? "#fff" : "#000"};
      &:hover {
        box-shadow: none;
        cursor: pointer;
        transform: translateY(2px);
      }
      transition: all 0.2s;
}


      .shepherd-button-primary {
      background-color: #FF4911;
      color: white;
      height: 30px;
      border: 2px solid white;
      outline: none;
      box-shadow: 3px 4px 0px 0px ${systemTheme === "dark" ? "#fff" : "#000"};
      &:hover {
        box-shadow: none;
        cursor: pointer;
        transform: translateY(2px);
      }
      transition: all 0.2s;
}
      .shepherd-cancel-icon {
      position: absolute;
      top: 10px;
      right: 10px;
       background-color: #FF4911;
      color: white;
   
      border: 2px solid white;
      outline: none;
      box-shadow: 4px 6px 0px 0px ${systemTheme === "dark" ? "#fff" : "#000"};
}
  `;
  return styleElement;
};

const TourButton = ({
  onClick,
  container,
}: {
  onClick: () => void;
  container: HTMLElement;
}) => {
  const Shepherd = useShepherd();
  const tour = new Shepherd.Tour({
    ...tourOptions,
    steps: tourSteps,

    useModalOverlay: true,
    stepsContainer: container,
  });

  return (
    <>
      <OutlinedButton
        onClick={() => {
          onClick();
          tour.start();
        }}
      >
        Lets Go!
      </OutlinedButton>
    </>
  );
};

let container: Element | null = null;
export const mountShadowHost: PlasmoMountShadowHost = ({
  shadowHost,
  anchor,
}) => {
  anchor?.element.appendChild(shadowHost);
  container = shadowHost;
};

function OnboardingModal() {
  const [open, setOpen] = useState(false);

  const { data: token } = useGetAuthToken();
  const { data: user } = useGetUser({ disabled: !token });

  const c = container?.shadowRoot?.querySelector(Selectors.SHADOW_CONTAINER);

  useEffect(() => {
    const open = localStorage.getItem("thatrundown-demo-done");
    console.log("GOT STATE", open);
    if (!open && user) {
      setOpen(true);
    }
  }, [user]);

  return (
    <CacheProvider value={styleCache}>
      <ThatRundownThemeProvider>
        <Box
          sx={{
            "& .shepherd-content": {
              width: "400px",
            },
            "& .shepherd-title": {
              fontSize: 24,
            },
            "& .shepherd-text": {
              fontSize: 20,
            },
            "& .shepherd-element": {
              background: "white",
            },
          }}
        >
          <ShepherdJourneyProvider>
            <Dialog open={open} onClose={() => setOpen(false)} container={c}>
              <DialogContent>
                <Typography variant="h4">Welcome to That Rundown!</Typography>
                <Typography variant="body1">
                  We're excited to have you here. Let's get started with a quick
                  onboarding.
                </Typography>
              </DialogContent>
              <DialogActions>
                <TourButton
                  onClick={() => setOpen(false)}
                  container={c as HTMLElement}
                />
              </DialogActions>
            </Dialog>
          </ShepherdJourneyProvider>
        </Box>
      </ThatRundownThemeProvider>
    </CacheProvider>
  );
}

export default function Onboarding() {
  const [queryClient] = useState(createQueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      <OnboardingModal />
    </QueryClientProvider>
  );
}
