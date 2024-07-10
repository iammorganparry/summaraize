import OpenAI from "openai";

export const getOpenAI = () =>
  new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
    maxRetries: 3,
  });
