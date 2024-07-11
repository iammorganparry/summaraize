import { CircularProgress, type ButtonProps } from "@mui/material";
import { OutlinedButton } from "./outlined";

export const LoadingButton = ({
  children,
  loading,
  ...others
}: {
  children: React.ReactNode;
  loading: boolean;
} & Omit<ButtonProps, "ref">) => (
  <OutlinedButton {...others} disabled={loading ?? others.disabled}>
    {loading ? <CircularProgress size="14px" /> : children}
  </OutlinedButton>
);
