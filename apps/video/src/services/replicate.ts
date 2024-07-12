import Replicate from "replicate";
// Instantiate the Replicate API
export const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});

export type { Replicate };
