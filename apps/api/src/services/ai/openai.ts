import fs from "node:fs";
import type OpenAI from "openai";
import type { OpenAIError } from "openai/error.mjs";
import type winston from "winston";
import type ffmpeg from "fluent-ffmpeg";

import path from "node:path";
import { Readable } from "node:stream";

export class OpenAIService {
  readonly MODEL = "whisper-1";
  constructor(
    private readonly client: OpenAI,
    private readonly videoClient: typeof ffmpeg,
    private logger: winston.Logger
  ) {}

  public extractAudioFromVideo(path: string) {
    try {
      const audioPath = path.replace(/\.\w+$/, ".mp3");
      this.videoClient(fs.createReadStream(path))
        .output(audioPath)
        .noVideo()
        .format("mp3")
        .on("end", () => {
          this.logger.info("Successfully extracted audio from video:", {
            audioPath,
          });
        })
        .run();

      return audioPath;
    } catch (error) {
      const err = error as Error;
      this.logger.error("Failed to extract audio from video:", { error: err });
      throw err;
    }
  }

  /**
   *
   * @param url  The URL of the file to transcribe
   * @returns A readable stream of the file
   *
   * @example
   * ```ts
   * const file = await this.getFileFromUrl("https://example.com/file.mp4");
   * ```
   */
  public async createFileFromUrl(url: string): Promise<string> {
    this.logger.info("Fetching file from:", { url });
    const body = await fetch(url)
      .then((res) => res.body)
      .catch((error: Error) => {
        this.logger.error("Failed to fetch file:", { error });
        throw new Error(
          `[OpenAIService] Failed to fetch file: ${error.message}`
        );
      });

    this.logger.info("Successfully fetched file:", { url, body });

    // save the file to disk
    const fileName = `${url.split("/").pop()}.mp4` || "file.mp4";

    if (!fileName) {
      this.logger.error("Failed to extract file name from URL:", { url });
      throw new Error(
        `[OpenAIService] Failed to extract file name from URL, invalid URL: ${url}. Please provide a valid URL. Example: https://example.com/file.mp4`
      );
    }

    if (body) {
      const nodeStream = Readable.fromWeb(body); // Convert the web API ReadableStream to a Node.js stream
      // save to memory not on disk and return the file path
      const filePath = path.resolve(__dirname, fileName);
      nodeStream.pipe(fs.createWriteStream(filePath));
      return filePath;
    }
    this.logger.error("Failed to fetch file:", { url });
    return "";
  }

  // return the file path

  public async transcribe(filePath: string) {
    try {
      return await this.client.audio.transcriptions.create({
        file: fs.createReadStream(filePath),
        model: this.MODEL,
        language: "en", //TODO: make this configurable
      });
    } catch (error) {
      const err = error as OpenAIError;
      this.logger.error("Failed to transcribe audio:", { error: err });
      throw err;
    }
  }
}
