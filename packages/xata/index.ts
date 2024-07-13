import { XataClient } from "./src/xata";

export type { AskResult } from "@xata.io/client";

let instance: XataClient | undefined = undefined;

export type { XataClient };

export const getXataClient = () => {
  if (instance) return instance;
  console.log("Creating new XataClient instance", {
    apiKey: process.env.XATA_API_KEY,
    branch: process.env.XATA_BRANCH,
  });
  instance = new XataClient({
    apiKey: process.env.XATA_API_KEY || "",
    branch: process.env.XATA_BRANCH || "",
  });
  return instance;
};

export const xata = getXataClient();
