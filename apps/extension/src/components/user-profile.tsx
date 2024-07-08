import React from "react";
import { useUser } from "@clerk/chrome-extension";
import Avatar from "@mui/material/Avatar";
import Card from "@mui/material/Card";
import Typography from "@mui/material/Typography";

export const UserProfile = () => {
  const { user } = useUser();
  return (
    <Card
      variant="elevation"
      elevation={0}
      sx={{
        display: "flex",
        alignItems: "center",
        gap: 1,
      }}
    >
      <Avatar
        src={user?.imageUrl}
        variant="square"
        sx={{ border: (theme) => `3px solid ${theme.palette.text.primary}` }}
      />
      <Typography variant="body2">{user?.fullName}</Typography>
    </Card>
  );
};
