import type ytdl from "@distube/ytdl-core";
import OpenAI from "openai";
import type { UploadFileResult } from "uploadthing/types";
import { printNode, zodToTs } from "zod-to-ts";
import { SummarySchema } from "../schema/summary";
import type { OpenAIError } from "openai/error.mjs";
import type winston from "winston";
import fs from "node:fs";

export const getOpenAI = () =>
  new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
    maxRetries: 3,
  });

export class OpenAiService {
  readonly AUDIO_MODEL = "whisper-1";
  readonly EMBEDDING_MODEL = "text-embedding-3-small";
  readonly CHAT_MODEL = "gpt-4o";

  constructor(
    private ai: OpenAI,
    private readonly logger: winston.Logger,
  ) {}

  get api() {
    return this.ai;
  }

  public async transcribe(filePath: string) {
    try {
      this.logger.info("Transcribing audio:", { filePath });
      const file = fs.createReadStream(filePath);

      return await this.ai.audio.transcriptions.create({
        file: file,
        model: this.AUDIO_MODEL,
        language: "en",
        prompt:
          "Transcribe the following audio file.. Be sure to include important timestamps of the audio that can be used to create chapters.",
      });
    } catch (error) {
      const err = error as OpenAIError;
      this.logger.error("Failed to transcribe audio:", { error: err });
      throw err;
    }
  }

  public async summarize(
    videoMetaData: ytdl.MoreVideoDetails,
    transcription: string,
    uploadedImages: UploadFileResult[],
  ) {
    try {
      const response = await this.ai.chat.completions.create({
        model: this.CHAT_MODEL,
        temperature: 0,
        max_tokens: 2000,
        messages: [
          {
            role: "system",
            content: `You are a helpful assistant that summarizes and creates chapters of a video from a transcription and image frames. Please summarize who is in the video, what they are doing, who is talking to who, and any other important details. 
                Then create chapters that align to the events in the video.\
                The summary should include the video information, transcription, and any images that were uploaded and any relevant timestamps. \n
                You must return the summary in a json format. Please refer to the required format below. \n
                output the message in the following format: ${printNode(zodToTs(SummarySchema).node)} \n
                you must at all times generate a html formatted summary that adheres to the provided format. with no markdown formatting at all. \n
                 \n`,
          },
          {
            role: "user",
            content: [
              {
                type: "text",
                text: `Here is the video information: 
              Title: ${videoMetaData.title}
              Description: ${videoMetaData.description}
              Channel: ${videoMetaData.author}
              Duration: ${videoMetaData.lengthSeconds}
              `,
              },
              {
                type: "text",
                text: `Here is the transcription of the video: ${transcription}`,
              },
              {
                type: "text",
                text: "Here are the uploaded frames:",
              },
              // @ts-expect-error
              ...uploadedImages.map((image) => ({
                type: "image_url",
                image_url: {
                  url: image.data?.url,
                  detail: "low",
                },
              })),
            ],
          },
        ],
      });
      const responseContent = response.choices[0].message?.content;

      if (typeof responseContent === "string") {
        return SummarySchema.parse(JSON.parse(responseContent));
      }
      throw new Error("Failed to parse response content");
    } catch (error) {
      const err = error as OpenAIError;
      this.logger.error("Failed to summarize video:", { error: err });
      throw err;
    }
  }

  public async generateEmbeddings(input: string) {
    try {
      this.logger.info("Generating embeddings for transcription and summary");
      const embeddings = await this.ai.embeddings.create({
        model: "text-embedding-3-small",
        input: input,
        dimensions: 1536,
      });
      this.logger.info("Embeddings generated successfully");
      return embeddings.data[0].embedding;
    } catch (error) {
      const err = error as OpenAIError;
      this.logger.error("Failed to generate embeddings:", { error: err });
      throw err;
    }
  }
}
