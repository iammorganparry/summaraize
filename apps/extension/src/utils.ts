export const getYoutubeTheme = () => {
  // Get the youtube theme => get the attribute darker-dark-theme from the html tag
  return document.documentElement.getAttribute("darker-dark-theme") === ""
    ? "dark"
    : "light";
};
export const getSystemTheme = () => {
  // Get the system theme
  // if we are on youtube, we can get the theme from the html tag
  if (window.location.hostname.includes("youtube.com")) {
    return getYoutubeTheme();
  }

  const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
  return systemTheme;
};

export const sleep = (ms: number) =>
  new Promise((resolve) => setTimeout(resolve, ms));

export const truncate = (str: string, n: number) =>
  str.length > n ? `${str.substr(0, n - 1)}...` : str;
