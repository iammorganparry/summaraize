export type EventTypes = import("./src/api/messages").EventTyped;

type EventPayloads<TMessage extends EventTypes[keyof EventTypes]> = {
  "create.toast": {
    message: string;
    type: "success" | "error" | "info" | "warning";
  };
  "navigate.to.summary": {
    path: string;
  };
}[TMessage];

declare global {
  interface ElementEventMap {
    "create.toast": CustomEvent<EventPayloads<"create.toast">>;
    "navigate.to.summary": CustomEvent<EventPayloads<"navigate.to.summary">>;
  }

  interface Window
    extends EventTarget,
      AnimationFrameProvider,
      GlobalEventHandlers,
      WindowEventHandlers,
      WindowLocalStorage,
      WindowOrWorkerGlobalScope,
      WindowSessionStorage {
    addEventListener<TMessage extends EventTypes[keyof EventTypes]>(
      type: TMessage,
      listener: (this: Element, ev: ElementEventMap[TMessage]) => void,
      options?: boolean | AddEventListenerOptions,
    ): void;
  }
}
