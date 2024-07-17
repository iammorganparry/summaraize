export const EventTypes = {
  TOAST_MESSAGE: "create.toast",
  NAVIGATE_TO_SUMMARY: "navigate.to.summary",
} as const;

export type EventTyped = typeof EventTypes;

export const createToastMessage = (
  message: string,
  type: "success" | "error" | "info" | "warning" = "info"
) => {
  const event = new CustomEvent(EventTypes.TOAST_MESSAGE, {
    detail: { message, type },
  });
  return window.dispatchEvent(event);
};

export const openFlyout = (path: string) => {
  const event = new CustomEvent(EventTypes.NAVIGATE_TO_SUMMARY, {
    detail: { path },
  });
  return window.dispatchEvent(event);
};
