import { type Theme, createTheme } from "@mui/material/styles";

export const createThatRundownTheme = (overrides?: Partial<Theme>, mode: "light" | "dark" = "light") =>
  createTheme(
    {
      typography: {
        fontFamily: '"Public Sans", sans-serif',
        body1: {
          fontSize: "16px",
        },
        body2: {
          fontSize: "14px",
        },
        h1: {
          fontSize: "40px",
          fontWeight: 600,
        },
        h2: {
          fontSize: "32px",
          fontWeight: 600,
        },
        h3: {
          fontSize: "24px",
          fontWeight: 600,
        },
        h4: {
          fontSize: "20px",
          fontWeight: 600,
        },
        h5: {
          fontSize: "16px",
          fontWeight: 600,
        },
        caption: {
          fontSize: "12px",
        },
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
