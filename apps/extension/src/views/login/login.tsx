import React, { useState } from "react";
import Button from "@mui/material/Button";
import { useSignIn } from "@clerk/chrome-extension";
import type { OAuthStrategy } from "@clerk/types";
import { Box, Stack, Typography } from "@mui/material";
import { FaGithub } from "react-icons/fa";
import { FaGoogle } from "react-icons/fa";

type ClerkError = {
  errors: {
    message: string;
  }[];
};

export const LoginPage = () => {
  const [authError, setAuthError] = useState<string | null>(null);
  const { isLoaded, signIn, setActive } = useSignIn();

  const handleProviderLogin = async (strategy: OAuthStrategy) => {
    try {
      const url = await signIn
        ?.create({
          strategy,
          redirectUrl: "/",
        })
        .catch((err: ClerkError) => {
          setAuthError(err?.errors?.[0]?.message);
        });

      const redirectUrl = url?.firstFactorVerification.externalVerificationRedirectURL;

      if (!redirectUrl) {
        console.warn("No redirect URL found");
        return;
      }

      window.open(redirectUrl, "_blank");

      // set a max limit of 30 secs
      const timeout = setTimeout(() => {
        console.error("Timeout -- user did not complete Google verification");
        clearInterval(interval);
      }, 30000);

      // poll every 2 seconds to check if the user has completed the verification
      const interval = setInterval(async () => {
        const s = await signIn?.reload().catch((err: ClerkError) => {
          setAuthError(err?.errors?.[0]?.message);
        });

        if (s?.status === "complete") {
          clearInterval(interval);
          clearTimeout(timeout);
          console.log("Clearing Timers");
          await setActive?.({ session: s.createdSessionId });
        }
      }, 2000);
    } catch (error) {
      const err = error as Error;
      console.log(err.message);
    }
  };

  if (!isLoaded) {
    return <p>Loading...</p>;
  }

  return (
    <Box
      sx={{
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        width: "100%",
        flexDirection: "column",
      }}
    >
      <Stack sx={{ mb: 4 }}>
        <Typography variant="h4">Sign in to</Typography>
        <Typography
          variant="h1"
          align="center"
          sx={{
            fontWeight: "bold",
            color: "primary.main",
            textTransform: "uppercase",
          }}
        >
          Summaraize
        </Typography>
      </Stack>
      <Stack spacing={2} gap={3}>
        <Button
          sx={{
            width: "400px",
            height: "50px",
            boxShadow: (theme) => theme.shadows[3],
          }}
          variant="outlined"
          startIcon={<FaGoogle />}
          onClick={() => handleProviderLogin("oauth_google")}
          color="primary"
        >
          Sign in with Google
        </Button>
        <Button
          sx={{
            width: "400px",
            height: "50px",
            boxShadow: (theme) => theme.shadows[3],
          }}
          startIcon={<FaGithub />}
          onClick={() => handleProviderLogin("oauth_github")}
          variant="contained"
          color="primary"
        >
          Sign in with Github
        </Button>
        {authError && (
          <Typography color="red" variant="caption">
            {authError}
          </Typography>
        )}
      </Stack>
    </Box>
  );
};
