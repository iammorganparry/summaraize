import { SignedIn, SignedOut } from "@clerk/chrome-extension";
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
import { ChatWithThatRundown } from "~views/chat/chat";
import { RequestListPage } from "~views/requests/requests";

export function ThatRundownSheet({
  shadowHost,
  open,
  onClose,
  onOpen,
}: {
  shadowHost: Element | null;
  open: boolean;
  onClose: () => void;
  onOpen: () => void;
}) {
  const location = useLocation();

  const container = shadowHost?.shadowRoot?.querySelector(Selectors.SHADOW_CONTAINER);

  return (
    <>
      <Button
        id="that-rundown-sheet-button"
        onClick={onOpen}
        variant="contained"
        color="primary"
        sx={{
          opacity: open ? 0 : 1,
          position: "fixed",
          top: "1rem",
          zIndex: 1300,
          width: "30px",
          minWidth: "unset",
          // vertical text
          height: "100px",
          right: open ? Sizes.SLIDER_WIDTH : 0,
          transition: "right 225ms cubic-bezier(0, 0, 0.2, 1) 0ms",
          boxShadow: (theme) => theme.shadows[2],
          "&:hover": {
            boxShadow: (theme) => theme.shadows[0],
          },
        }}
      >
        <Typography sx={{ transform: "rotate(90deg)" }} variant="caption">
          That Rundown
        </Typography>
      </Button>
      <Drawer
        container={container}
        anchor="right"
        open={open}
        onClose={onClose}
        PaperProps={{
          sx: {
            width: Sizes.SLIDER_WIDTH,
            maxWidth: Sizes.SLIDER_WIDTH,
            boxShadow: (theme) => (open ? `"-12px 20px 0 0 ${theme.palette.common.black}"` : "none"),
            borderLeft: (theme) => `4px solid ${theme.palette.common.white}`,
          },
        }}
      >
        <SignedIn>
          <RouteContainer>
            <Routes location={location} key={location.key}>
              <Route path="/" element={<SummaryList />} />
              <Route path="/summary/:videoUrl" element={<ViewSummary />} />
              <Route path="/chat" element={<ChatWithThatRundown />} />
              <Route path="/requests" element={<RequestListPage />} />
            </Routes>
          </RouteContainer>
          <FooterNav />
        </SignedIn>
        <SignedOut>
          <LoginPage />
        </SignedOut>
      </Drawer>
    </>
  );
}
