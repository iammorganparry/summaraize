import { SignedIn, SignedOut } from "@clerk/chrome-extension";
import { useState } from "react";
import Drawer from "@mui/material/Drawer";
import Button from "@mui/material/Button";

import { Selectors, Sizes } from "./constants";
import { LoginPage } from "~views/login/login";
import { Route, Routes, useLocation } from "react-router-dom";
import { SummaryList } from "./list";
import { RouteContainer } from "~components/containers";
import { ViewSummary } from "./view-summary";
import { Typography } from "@mui/material";
import { FooterNav } from "~components/footer";
import { ChatWithSummaraize } from "~views/chat/chat";

export function SummaraizeSheet({
  shadowHost,
}: {
  shadowHost: Element | null;
}) {
  const location = useLocation();

  const [state, setState] = useState({
    open: false,
  });

  const container = shadowHost?.shadowRoot?.querySelector(
    Selectors.SHADOW_CONTAINER
  );

  const handleClose = () => {
    setState({ open: false });
  };

  return (
    <>
      <Button
        onClick={() => setState((ps) => ({ open: !ps.open }))}
        variant="contained"
        color="primary"
        sx={{
          opacity: state.open ? 0 : 1,
          position: "fixed",
          top: "1rem",
          zIndex: 1300,
          width: "30px",
          minWidth: "unset",
          // vertical text
          height: "100px",
          right: state.open ? Sizes.SLIDER_WIDTH : 0,
          transition: "right 225ms cubic-bezier(0, 0, 0.2, 1) 0ms",
          boxShadow: (theme) => theme.shadows[2],
          "&:hover": {
            boxShadow: (theme) => theme.shadows[0],
          },
        }}
      >
        <Typography sx={{ transform: "rotate(90deg)" }} variant="caption">
          Summaraize
        </Typography>
      </Button>
      <Drawer
        container={container}
        anchor="right"
        open={state.open}
        onClose={handleClose}
        PaperProps={{
          sx: {
            maxWidth: Sizes.SLIDER_WIDTH,
            boxShadow: (theme) =>
              state.open
                ? `"-12px 20px 0 0 ${theme.palette.common.black}"`
                : "none",
            borderLeft: (theme) => `4px solid ${theme.palette.common.white}`,
          },
        }}
      >
        <SignedIn>
          <RouteContainer>
            <Routes location={location} key={location.key}>
              <Route path="/" element={<SummaryList />} />
              <Route path="/summary/:videoUrl" element={<ViewSummary />} />
              <Route path="/chat" element={<ChatWithSummaraize />} />
              <Route path="/search" element={<>Search</>} />
            </Routes>
            <FooterNav />
          </RouteContainer>
        </SignedIn>
        <SignedOut>
          <LoginPage />
        </SignedOut>
      </Drawer>
    </>
  );
}
