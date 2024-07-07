export const EventTypes = {
	TOAST_MESSAGE: "create.toast",
} as const;

export type EventTyped = typeof EventTypes;

export const createToastMessage = (
	message: string,
	type: "success" | "error" | "info" | "warning" = "info",
) => {
	const event = new CustomEvent(EventTypes.TOAST_MESSAGE, {
		detail: { message, type },
	});
	console.log("[createToastMessage] sending message", event);
	return window.dispatchEvent(event);
};
