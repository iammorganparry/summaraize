import { ThemeProvider } from "@emotion/react";
import { createTheme } from "@mui/material";
import { createSummaraizeTheme } from "~theme";
import { getSystemTheme } from "~utils";

export const SummaraizeThemeProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const systemTheme = getSystemTheme();
  const theme = createSummaraizeTheme({}, systemTheme) ?? createTheme();
  return (
    <ThemeProvider theme={theme || createTheme()}>{children}</ThemeProvider>
  );
};
