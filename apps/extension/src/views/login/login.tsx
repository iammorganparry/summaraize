import { useState } from "react";
import Button from "@mui/material/Button";
import { SignInButton, useSignIn, useSignUp } from "@clerk/chrome-extension";
import type { OAuthStrategy } from "@clerk/types";
import { Box, Stack, Typography, styled } from "@mui/material";
import { FaGithub } from "react-icons/fa";
import { FaGoogle } from "react-icons/fa";

type ClerkError = {
  errors: {
    message: string;
  }[];
};

const StyledButton = styled(SignInButton)(({ theme }) => ({
  fontWeight: 600,
  fontSize: 16,
  zIndex: 3,
  marginBottom: theme.spacing(1),
  gap: theme.spacing(1),
  margin: `0 ${theme.spacing(2)} 0 ${theme.spacing(2)}`,
  boxShadow: theme.shadows[2],
  "&:hover": {
    // move the button Y position up by 1px to create a 3D effect
    transform: "translateY(4px)",
    boxShadow: theme.shadows[0],
    cursor: "pointer",
  },
  transition: "all 0.2s",
  backgroundColor: "transparent",
  width: "100%",
  color: theme.palette.common.white,
  minWidth: 400,
  height: 48,
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  textTransform: "uppercase",
  border: `3px solid ${theme.palette.common.white}`,
}));

export const LoginPage = () => {
  const { isLoaded } = useSignIn();

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
        <StyledButton mode="redirect" />
      </Stack>
    </Box>
  );
};
