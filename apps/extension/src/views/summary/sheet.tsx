import { SignedIn, SignedOut, useAuth, useUser } from "@clerk/chrome-extension";
import { useCallback, useEffect, useState } from "react";
import Drawer from "@mui/material/Drawer";
import Button from "@mui/material/Button";

import { Selectors, Sizes } from "./constants";
import { LoginPage } from "~views/login/login";
import { Footer } from "~components/footer";
import { Route, Routes } from "react-router-dom";
import { SummaryList } from "./list";
import { RouteContainer } from "~components/containers";
import { storage } from "~lib/storage/client";

export function SummaraizeSheet({
  shadowHost,
}: {
  shadowHost: Element | null;
}) {
  const [state, setState] = useState({
    open: false,
  });

  const user = useUser();

  const { getToken } = useAuth();

  const container = shadowHost?.shadowRoot?.querySelector(
    Selectors.SHADOW_CONTAINER
  );

  const handleClose = () => {
    setState({ open: false });
  };

  /**
   * Save the token to storage for use in the buttons
   */
  const saveToken = useCallback(async () => {
    const token = await getToken();
    storage.set("clerk-token", token);
    storage.set("clerk-user", user);
  }, [getToken, user]);

  useEffect(() => {
    void saveToken();
  }, [saveToken]);

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
          height: "100px",
          right: state.open ? Sizes.SLIDER_WIDTH : 0,
          transition: "right 225ms cubic-bezier(0, 0, 0.2, 1) 0ms",
          "&:hover": {
            boxShadow: (theme) => theme.shadows[2],
          },
        }}
      >
        Summaraize
      </Button>
      <Drawer
        container={container}
        anchor="right"
        open={state.open}
        onClose={handleClose}
        PaperProps={{
          sx: {
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
            <Routes>
              <Route path="/" element={<SummaryList />} />
              <Route path="/chat" element={<>Chat</>} />
              <Route path="/search" element={<>Search</>} />
            </Routes>
          </RouteContainer>
          <Footer />
        </SignedIn>
        <SignedOut>
          <LoginPage />
        </SignedOut>
      </Drawer>
    </>
  );
}
