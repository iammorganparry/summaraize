import { useSignIn } from "@clerk/chrome-extension";
import { Box, Stack, Typography } from "@mui/material";
import { StyledSignInButton } from "~components/buttons/signin";

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
          That Rundown
        </Typography>
      </Stack>
      <Stack spacing={2} gap={3}>
        <StyledSignInButton mode="redirect" />
      </Stack>
    </Box>
  );
};
