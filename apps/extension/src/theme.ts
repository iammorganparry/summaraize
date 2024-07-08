import { type Theme, createTheme } from "@mui/material/styles";

export const createSummaraizeTheme = (overrides?: Partial<Theme>, mode: "light" | "dark" = "light") =>
  createTheme(
    {
      typography: {
        fontFamily: '"Public Sans", sans-serif',
      },
      palette: {
        mode,
        primary: {
          main: "#FF4911",
        },
        secondary: {
          main: "#3300FF",
        },
        success: {
          main: "#2FFF2F",
        },
        warning: {
          main: "#E3A018",
        },
        error: {
          main: "#FF6B6B",
        },
        text: {
          primary: mode === "dark" ? "#fff" : "#000",
          secondary: "#333",
        },
      },
      // annoying but material throws warnings like gang signs without 25 shadows
      shadows: [
        "none",
        `2px 4px 0px 0px ${mode === "dark" ? "#fff" : "#000"}`,
        `4px 6px 0px 0px ${mode === "dark" ? "#fff" : "#000"}`,
        `8px 10px 0px 0px ${mode === "dark" ? "#fff" : "#000"}`,
        `12px 14px 0px 0px ${mode === "dark" ? "#fff" : "#000"}`,
        `14px 16px 0px 0px ${mode === "dark" ? "#fff" : "#000"}`,
        `14px 16px 0px 0px ${mode === "dark" ? "#fff" : "#000"}`,
        `14px 16px 0px 0px ${mode === "dark" ? "#fff" : "#000"}`,
        `14px 16px 0px 0px ${mode === "dark" ? "#fff" : "#000"}`,
        `14px 16px 0px 0px ${mode === "dark" ? "#fff" : "#000"}`,
        `14px 16px 0px 0px ${mode === "dark" ? "#fff" : "#000"}`,
        `14px 16px 0px 0px ${mode === "dark" ? "#fff" : "#000"}`,
        `14px 16px 0px 0px ${mode === "dark" ? "#fff" : "#000"}`,
        `14px 16px 0px 0px ${mode === "dark" ? "#fff" : "#000"}`,
        `14px 16px 0px 0px ${mode === "dark" ? "#fff" : "#000"}`,
        `14px 16px 0px 0px ${mode === "dark" ? "#fff" : "#000"}`,
        `14px 16px 0px 0px ${mode === "dark" ? "#fff" : "#000"}`,
        `14px 16px 0px 0px ${mode === "dark" ? "#fff" : "#000"}`,
        `14px 16px 0px 0px ${mode === "dark" ? "#fff" : "#000"}`,
        `14px 16px 0px 0px ${mode === "dark" ? "#fff" : "#000"}`,
        `14px 16px 0px 0px ${mode === "dark" ? "#fff" : "#000"}`,
        `14px 16px 0px 0px ${mode === "dark" ? "#fff" : "#000"}`,
        `14px 16px 0px 0px ${mode === "dark" ? "#fff" : "#000"}`,
        `14px 16px 0px 0px ${mode === "dark" ? "#fff" : "#000"}`,
        `14px 16px 0px 0px ${mode === "dark" ? "#fff" : "#000"}`,
      ],
      components: {
        MuiCard: {
          defaultProps: {
            elevation: 0,
            variant: "outlined",
          },
          styleOverrides: {
            root: {
              borderColor: mode === "dark" ? "#fff" : "#000",
              borderWidth: 3,
              borderRadius: 0,
            },
          },
        },
        MuiButton: {
          defaultProps: {
            disableElevation: true,
            variant: "contained",
          },
          styleOverrides: {
            root: {
              border: `2px solid ${mode === "dark" ? "#fff" : "#000"}`,
              borderRadius: 0,
            },
          },
        },
      },
    },
    overrides ?? {},
  );
