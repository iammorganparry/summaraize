import { useEffect } from "react";
import { Toaster, toast } from "sonner";
import { getSystemTheme } from "../utils";
import { useTheme } from "@mui/material/styles";

export const ToasterBoi = () => {
  // he was a toaster boi
  const systemTheme = getSystemTheme();
  const theme = useTheme();

  useEffect(() => {
    window.addEventListener("create.toast", (event) => {
      console.log("[ToasterBoi]", event);
      toast[event.detail.type](event.detail.message);
    });
  }, []);

  return (
    <Toaster
      theme="system"
      toastOptions={{
        style: {
          position: "fixed",
          top: 10,
          padding: 8,
          height: 50,
          fontFamily: theme.typography.fontFamily,
          fontSize: 14,
          right: 10,
          display: "flex",
          alignItems: "center",
          gap: 2,
          zIndex: 1300,
          background: theme.palette.background.paper,
          borderRadius: 0,
          border: systemTheme === "dark" ? "3px solid #fff" : "3px solid #000",
          boxShadow: theme.shadows[3],
        },
      }}
    />
  );
  // she said see you later boi
};
