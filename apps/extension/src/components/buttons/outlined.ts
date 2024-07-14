import { Button, styled } from "@mui/material";

export const OutlinedButton = styled(Button)(({ theme }) => ({
  fontWeight: 600,
  fontSize: 12,
  zIndex: 3,
  marginBottom: theme.spacing(1),
  gap: theme.spacing(1),
  margin: `0 ${theme.spacing(2)} 0 ${theme.spacing(2)}`,
  color: theme.palette.common.white,
  boxShadow: theme.shadows[1],
  "&:hover": {
    boxShadow: theme.shadows[0],
  },
}));

export const ContainedButton = styled(Button)(({ theme }) => ({
  fontWeight: 600,
  fontSize: 12,
  zIndex: 3,
  marginBottom: theme.spacing(1),
  gap: theme.spacing(1),
  margin: `0 ${theme.spacing(2)} 0 ${theme.spacing(2)}`,
  boxShadow: theme.shadows[2],
  "&:hover": {
    boxShadow: theme.shadows[0],
  },
}));
