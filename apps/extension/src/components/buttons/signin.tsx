import { SignInButton } from "@clerk/chrome-extension";
import { styled } from "@mui/material";

export const StyledSignInButton = styled(SignInButton)(({ theme }) => ({
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
