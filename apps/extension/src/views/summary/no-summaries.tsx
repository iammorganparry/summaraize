import Box from "@mui/material/Box";
import { Typography } from "@mui/material";

export const NoSummaries = () => {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "50vh",
      }}
    >
      <Typography variant="h4">No summaries found</Typography>
    </Box>
  );
};
