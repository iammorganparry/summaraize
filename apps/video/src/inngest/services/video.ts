import fs from "node:fs";
import type OpenAI from "openai";
import type { OpenAIError } from "openai/error";
import type winston from "winston";
import type Ffmpeg from "fluent-ffmpeg";
import type ytdl from "ytdl-core";
import progress from "progress-stream";
import path from "node:path";
import type { PrismaClient } from "@summaraize/prisma";
import promiseFs from "node:fs/promises";
import type {
  AdaptiveFormat,
  VideoDetails,
  YoutubeVideoResponse,
} from "../../types/youtube";
import { responseToReadable } from "../../lib/utils";
export class VideoService {
  private videoFilePath: string;
  private audioFilePath: string;
  readonly MODEL = "whisper-1";
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
    return new Promise((resolve, reject) => {
      this.logger.info("Format chosen:", { data });

      if (!data.approxDurationMs) {
        this.logger.error("Failed to get target duration:", { data });
        throw new Error(
          `[VideoService] Failed to get target duration from format: ${JSON.stringify(
            data
          )}`
        );
      }

      const video = data.url;

      const writeable = fs.createWriteStream(outputFilePath);
      fetch(video).then((r) =>
        responseToReadable(r)
          .pipe(writeable)
          .on("progress", (progress) => {
            this.logger.info("Progress:", { progress });
          })
          .on("finish", () => {
            this.logger.info("Finished writing file:", { outputFilePath });
            resolve({ outputFilePath });
          })
          .on("close", () => {
            this.logger.info("Finished writing file:", { outputFilePath });
            resolve({ outputFilePath });
          })
      );
    });
  }

  public async getInfo(videoId: string): Promise<YoutubeVideoResponse> {
    // hard-coded from https://github.com/yt-dlp/yt-dlp/blob/master/yt_dlp/extractor/youtube.py
    const apiKey = "AIzaSyB-63vPrdThhKuerbB2N_l7Kwwcxj6yUAc";

    const headers = {
      "X-YouTube-Client-Name": "5",
      "X-YouTube-Client-Version": "19.09.3",
      Origin: "https://www.youtube.com",
      "User-Agent":
        "com.google.ios.youtube/19.09.3 (iPhone14,3; U; CPU iOS 15_6 like Mac OS X)",
      "content-type": "application/json",
    };

    const b = {
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
      `https://www.youtube.com/youtubei/v1/player?key${apiKey}&prettyPrint=false`,
      { method: "POST", body: JSON.stringify(b), headers }
    ).then((r) => r.json());
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

    const videoData = resp.streamingData.adaptiveFormats.find(
      (f) => f.mimeType.includes("video/mp4") && f.qualityLabel === "720p60"
    );

    const audioData = resp.streamingData.adaptiveFormats.find(
      (f) =>
        f.mimeType.includes("audio/mp4") &&
        f.audioQuality === "AUDIO_QUALITY_MEDIUM"
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

  private getImagesFromDir(dir: string) {
    // read the directory and return the images as base64
    return fs.readdirSync(dir).map((file) => {
      const base64_image = fs.readFileSync(`${dir}/${file}`, {
        encoding: "base64",
      });
      return base64_image;
    });
  }

  public async summarise(
    videoMetaData: VideoDetails,
    transcription: string,
    framesDir: string
  ) {
    try {
      const frames = this.getImagesFromDir(framesDir);

      return await this.ai.chat.completions.create({
        model: "gpt-4o",
        max_tokens: 2000,
        messages: [
          {
            role: "system",
            content:
              "You are a helpful assistant that summarizes a video from a transcription and frames. Please summarize who is in the video, what they are doing, who is talking to who, and any other important details.",
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
              // @ts-expect-error TODO: fix this
              ...frames.map((frame) => ({
                type: "image_url",
                image_url: {
                  url: `data:image/jpeg;base64,${frame}`,
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
