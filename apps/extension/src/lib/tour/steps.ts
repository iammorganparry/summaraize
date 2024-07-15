import type { StepOptions } from "shepherd.js";

export const tourSteps = [
  {
    id: "tenth",
    title: "The request button",
    text: [
      "Click here to request a summary of the current video! \nThe maximum length of the video that can be summarized is 15 minutes.. \n You can only request 5 summaries per day",
    ],
    attachTo: { element: "#thatrundown-request-summary-button", on: "bottom" },

    highlightClass: "highlight",
    arrow: true,
    canClickTarget: true,
    buttons: [
      {
        classes: "shepherd-button-primary",
        text: "Back",
        action() {
          this.back();
        },
      },
      {
        classes: "shepherd-button-primary",
        text: "Next",
        action() {
          this.next();
        },
      },
    ],
  },
  {
    id: "eleventh",
    text: [
      "Click here to open the slide out window, where you can view your summaries and chat.",
    ],
    attachTo: {
      element: () =>
        document
          .querySelector("#thatrundown-slider")
          ?.shadowRoot?.querySelector(
            "#that-rundown-sheet-button"
          ) as HTMLElement,
      on: "left",
    },
    scrollTo: true,
    canClickTarget: true,
    buttons: [
      {
        classes: "shepherd-button-primary",
        text: "Restart",
        action() {
          this.cancel();
          this.start();
        },
      },
      {
        classes: "shepherd-button-primary",
        text: "Done",
        action() {
          this.hide();
        },
      },
    ],
    arrow: true,
    when: {
      show: () => {
        localStorage.setItem("thatrundown-demo-done", JSON.stringify(true));
      },
    },
  },
] satisfies StepOptions[];
