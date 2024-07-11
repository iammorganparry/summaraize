import { Box, Button, Typography } from "@mui/material";
import { UserProfile } from "./user-profile";
import { ChevronLeft } from "@untitled-ui/icons-react";
import { useNavigate } from "react-router-dom";
import { OutlinedButton } from "./buttons/outlined";

export const Header = ({
  title,
  showBackBtn,
}: {
  title: string;
  showBackBtn?: boolean;
}) => {
  const navigate = useNavigate();

  // Call the goBack method to go back to the previous page
  return (
    <Box
      sx={{
        p: 2,
        gap: 2,
        justifyContent: "center",
        flexDirection: "column",
        display: "flex",
        backgroundColor: (theme) => theme.palette.background.paper,
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          width: "100%",
        }}
      >
        {showBackBtn && (
          <OutlinedButton
            startIcon={<ChevronLeft />}
            onClick={() => navigate("/")}
          >
            Back
          </OutlinedButton>
        )}
        <UserProfile />
      </Box>
      <Typography
        variant="h3"
        sx={{
          fontWeight: 600,
        }}
      >
        {title}
      </Typography>
    </Box>
  );
};
