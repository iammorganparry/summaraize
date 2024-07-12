import { XataClient } from "../xata";

let instance: XataClient | undefined = undefined;

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
