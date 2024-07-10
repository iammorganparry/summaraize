import fs from "node:fs";
import type OpenAI from "openai";
import type { OpenAIError } from "openai/error";
import type winston from "winston";
import type Ffmpeg from "fluent-ffmpeg";
import type ytdl from "ytdl-core";
import progress from "progress-stream";
import path from "node:path";
import type { PrismaClient } from "@summaraize/prisma";
import type {
  AdaptiveFormat,
  VideoDetails,
  YoutubeVideoResponse,
} from "../types/youtube";
import { Readable } from "node:stream";
import type { UploadFileResult } from "uploadthing/types";

export class VideoService {
  private videoFilePath: string;
  private audioFilePath: string;
  readonly MODEL = "whisper-1";
  private readonly API_KEY = process.env.YOUTU;
  private readonly MAX_FRAMES = 5;
  constructor(
    private readonly db: PrismaClient,
    private readonly ai: OpenAI,
    private readonly youtube: typeof ytdl,
    private readonly ffmpeg: typeof Ffmpeg,
    private logger: winston.Logger
  ) {
    this.videoFilePath = "";
    this.audioFilePath = "";
  }
  private get reliableHeaders() {
    return {
      "X-YouTube-Client-Name": "5",
      "X-YouTube-Client-Version": "19.09.3",
      Origin: "https://www.youtube.com",
      "User-Agent":
        "com.google.ios.youtube/19.09.3 (iPhone14,3; U; CPU iOS 15_6 like Mac OS X)",
      "content-type": "application/json",
    };
  }

  // return the file path

  public async transcribe(filePath: string) {
    try {
      this.logger.info("Transcribing audio:", { filePath });
      const file = fs.createReadStream(filePath);

      return await this.ai.audio.transcriptions.create({
        file: file,
        model: this.MODEL,
        language: "en", //TODO: make this configurable
      });
    } catch (error) {
      const err = error as OpenAIError;
      this.logger.error("Failed to transcribe audio:", { error: err });
      throw err;
    }
  }

  private sanitizeFileName(fileName: string) {
    // remove spaces and special characters and replace them with underscores
    return fileName.replace(/[^a-zA-Z0-9]/g, "_");
  }

  public async getItemFromYoutube(
    data: AdaptiveFormat,
    outputFilePath: string
  ): Promise<{ outputFilePath: string }> {
    // if the file already exists, return the path
    this.logger.info("Format chosen:", { data });

    if (!data.approxDurationMs) {
      this.logger.error("Failed to get target duration:", { data });
      throw new Error(
        `[VideoService] Failed to get target duration from format: ${JSON.stringify(
          data
        )}`
      );
    }

    const progressStream = progress({
      length: Number.parseInt(data.contentLength),
      time: 3000,
    });

    progressStream.on("progress", (progress) => {
      this.logger.info("Downloading video:", { progress });
    });

    const response = await fetch(data.url);

    if (!response.ok) throw new Error("Response is not ok.");

    if (!response.body) throw new Error("Response body is empty.");

    const writeStream = fs.createWriteStream(outputFilePath);

    // @ts-expect-error This type should be fine? it like wants a strict any.. bizarre
    const readable = Readable.fromWeb(response.body);

    readable.pipe(progressStream).pipe(writeStream);

    return await new Promise((resolve, reject) => {
      readable.on("end", () => resolve({ outputFilePath }));
      readable.on("error", reject);
    });
  }

  public async getInfo(videoId: string): Promise<YoutubeVideoResponse> {
    // hard-coded from https://github.com/yt-dlp/yt-dlp/blob/master/yt_dlp/extractor/youtube.py

    const body = {
      context: {
        client: {
          clientName: "IOS",
          clientVersion: "19.09.3",
          deviceModel: "iPhone14,3",
          userAgent:
            "com.google.ios.youtube/19.09.3 (iPhone14,3; U; CPU iOS 15_6 like Mac OS X)",
          hl: "en",
          timeZone: "UTC",
          utcOffsetMinutes: 0,
        },
      },
      videoId,
      playbackContext: {
        contentPlaybackContext: { html5Preference: "HTML5_PREF_WANTS" },
      },
      contentCheckOk: true,
      racyCheckOk: true,
    };

    return fetch(
      `https://www.youtube.com/youtubei/v1/player?key${this.API_KEY}&prettyPrint=false`,
      {
        method: "POST",
        body: JSON.stringify(body),
        headers: this.reliableHeaders,
      }
    ).then((r) => r.json());
  }

  private findSuitableVideoFormat(
    formats: AdaptiveFormat[]
  ): AdaptiveFormat | undefined {
    return formats.find(
      (f) =>
        (f.mimeType.includes("video/mp4") && f.qualityLabel === "720p60") ||
        f.qualityLabel === "720p"
    );
  }

  private findSuitableAudioFormat(
    formats: AdaptiveFormat[]
  ): AdaptiveFormat | undefined {
    return formats.find(
      (f) =>
        f.mimeType.includes("audio/mp4") &&
        f.audioQuality === "AUDIO_QUALITY_MEDIUM"
    );
  }

  public async createFilesFromYoutubeUrl(url: string): Promise<{
    outputFilePath: string;
    audioFilePath: string;
    videoMetaData: VideoDetails;
  }> {
    const id = url.split("v=").pop() || url.split("/").pop();

    if (!id) {
      this.logger.error("Failed to extract video id from URL:", { url });
      throw new Error(
        `[VideoService] Failed to extract video id from URL, invalid URL: ${url}. Please provide a valid URL. Example: https://youtu.be/221F55VPp2M or https://www.youtube.com/watch?v=221F55VPp2M`
      );
    }

    const resp = await this.getInfo(id).catch((error: Error) => {
      this.logger.error("Failed to fetch file:", { error });
      throw new Error(`[VideoService] Failed to fetch file: ${error.message}`);
    });

    const videoData = this.findSuitableVideoFormat(
      resp.streamingData.adaptiveFormats
    );

    const audioData = this.findSuitableAudioFormat(
      resp.streamingData.adaptiveFormats
    );

    this.logger.info("Video & Audio data:", { videoData, audioData });

    if (!videoData || !audioData) {
      this.logger.error("Failed to get video/audio data:", {
        videoData,
        audioData,
      });
      throw new Error(
        `[VideoService] Failed to get video/audio data from youtube response: ${JSON.stringify(
          resp
        )}`
      );
    }

    const outputFilePath = `video_${this.sanitizeFileName(resp.videoDetails.title)}.mp4`;
    const audioFilePath = `audio_${this.sanitizeFileName(resp.videoDetails.title)}.mp3`;

    this.videoFilePath = outputFilePath;
    this.audioFilePath = audioFilePath;

    if (fs.existsSync(outputFilePath) && fs.existsSync(audioFilePath)) {
      this.logger.info("Files already exists:", { outputFilePath });
      return {
        outputFilePath,
        videoMetaData: resp.videoDetails,
        audioFilePath,
      };
    }

    const [{ outputFilePath: video }, { outputFilePath: audio }] =
      await Promise.all([
        this.getItemFromYoutube(videoData, outputFilePath),
        this.getItemFromYoutube(audioData, audioFilePath),
      ]);

    return {
      outputFilePath: video,
      audioFilePath: audio,
      videoMetaData: resp.videoDetails,
    };
  }

  private slugifyPath(path: string) {
    return path.replace(/[^a-zA-Z0-9]/g, "-");
  }

  public async extractFrames(filePath: string): Promise<string> {
    this.logger.info("Extracting frames:", { filePath });
    return new Promise((resolve, reject) => {
      // create a directory to store the frames
      const outputDir = path.join("frames", this.slugifyPath(filePath));
      fs.mkdirSync(outputDir, { recursive: true });
      // extract a frame every X seconds based on Y length of the video
      const command = this.ffmpeg(filePath)
        .on("start", (cmd) => this.logger.info({ cmd }))
        .outputOptions("-vf", "fps=3/60")
        .on("end", () => {
          this.logger.info("Frames extracted:", { outputDir });
          resolve(outputDir);
        })
        .on("error", (error: Error) => {
          this.logger.error("Failed to extract frames:", { error });
          reject(error);
        })
        .output(`${outputDir}/frame-%d.jpg`);

      command.run();
    });
  }

  public async summarise(
    videoMetaData: VideoDetails,
    transcription: string,
    uploadedImages: UploadFileResult[]
  ) {
    try {
      return await this.ai.chat.completions.create({
        model: "gpt-4o",
        max_tokens: 2000,
        messages: [
          {
            role: "system",
            content: `You are a helpful assistant that summarizes a video from a transcription and frames. Please summarize who is in the video, what they are doing, who is talking to who, and any other important details.
              You must return the summary in a html format. including any newlines, bullet points, or other formatting that you think would be helpful for the user to understand the video.
              You must include the frame urls in the summary ouput when referencing them.`,
          },
          {
            role: "user",
            content: [
              {
                type: "text",
                text: `Here is the video information: 
            Title: ${videoMetaData.title}
            Description: ${videoMetaData.shortDescription}
            Channel: ${videoMetaData.author}
            Duration: ${videoMetaData.lengthSeconds}
            `,
              },
              {
                type: "text",
                text: `Here is the transcription of the video: ${transcription}`,
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
    } catch (error) {
      const err = error as OpenAIError;
      this.logger.error("Failed to summarize video:", { error: err });
      throw err;
    }
  }

  public cleanup({
    audioFilePath,
    outputFilePath,
    frames,
  }: {
    audioFilePath: string;
    outputFilePath: string;
    frames: string;
  }) {
    this.logger.info("Cleaning up:", { audioFilePath, outputFilePath, frames });

    fs.unlinkSync(audioFilePath);
    fs.unlinkSync(outputFilePath);
    fs.rmdirSync(frames, { recursive: true });
  }

  public async saveSummary({
    userId,
    videoUrl,
    summary,
    transcription,
    videoMetaData,
  }: {
    userId: string;
    summary: string;
    videoUrl: string;
    transcription: string;
    videoMetaData: VideoDetails;
  }) {
    return await this.db.summary.upsert({
      where: {
        video_url: videoUrl,
      },
      update: {}, // Not going to change
      create: {
        users: {
          connect: {
            id: userId,
          },
        },
        name: videoMetaData.title,
        summary,
        transcription,
        video: {
          create: {
            user: {
              connect: {
                id: userId,
              },
            },
            data_raw: JSON.stringify(videoMetaData),
            name: videoMetaData.title,
            duration: videoMetaData.lengthSeconds,
            thumbnail: videoMetaData.thumbnail.thumbnails[0].url,
            url: videoUrl,
            views: videoMetaData.viewCount,
            authors: {
              create: {
                name: videoMetaData.author,
                avatar: "",
                channel_url: "",
              },
            },
          },
        },
      },
    });
  }
}
