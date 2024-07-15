import { ThemeProvider } from "@emotion/react";
import { createTheme } from "@mui/material";
import { createThatRundownTheme } from "~theme";
import { getSystemTheme } from "~utils";

export const ThatRundownThemeProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const systemTheme = getSystemTheme();
  const theme = createThatRundownTheme({}, systemTheme) ?? createTheme();
  return <ThemeProvider theme={theme || createTheme()}>{children}</ThemeProvider>;
};
