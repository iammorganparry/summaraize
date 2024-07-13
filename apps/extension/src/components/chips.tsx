import { Chip, styled } from "@mui/material";

export const SmallChip = styled(Chip)(({ theme }) => ({
  borderRadius: 0,
  border: `2px solid ${theme.palette.common.white}`,
  maxWidth: "100px",
  height: "20px",
  "& .MuiChip-root": {
    fontSize: "10px !important",
  },
}));
