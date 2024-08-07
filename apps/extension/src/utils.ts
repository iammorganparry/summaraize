import type { Message } from "ai";

export const getYoutubeTheme = () => {
  // Get the youtube theme => get the attribute darker-dark-theme from the html tag
  return document.documentElement.getAttribute("darker-dark-theme") === "" ? "dark" : "light";
};
export const getSystemTheme = () => {
  // Get the system theme
  // if we are on youtube, we can get the theme from the html tag
  if (window.location.hostname.includes("youtube.com")) {
    return getYoutubeTheme();
  }

  const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  return systemTheme;
};

export const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const truncate = (str: string, n: number) => (str.length > n ? `${str.substr(0, n - 1)}...` : str);

export const routeVariants = {
  initial: {
    y: "100vh",
  },
  final: {
    y: "0vh",
    transition: {
      type: "spring",
      mass: 0.4,
    },
  },
};

export const childVariants = {
  initial: {
    opacity: 0,
    y: "50px",
  },
  final: {
    opacity: 1,
    y: "0px",
    transition: {
      duration: 0.5,
      delay: 0.5,
    },
  },
};

export const removeExtraParams = (url: string) => {
  const urlObj = new URL(url);
  urlObj.searchParams.delete("t");
  return urlObj.toString();
};

export const isMostRecentMessage = (message: Partial<Message>, messages: Partial<Message>[]) => {
  const mostRecentMessage = messages[0];
  return mostRecentMessage.id === message.id;
};
