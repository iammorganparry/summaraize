import fs from "node:fs";
import type winston from "winston";
import type Ffmpeg from "fluent-ffmpeg";
import type ytdl from "@distube/ytdl-core";
import progress from "progress-stream";
import path from "node:path";
import type { AdaptiveFormat, YoutubeVideoResponse } from "../types/youtube";
import type { downloadOptions } from "@distube/ytdl-core";
import type Pusher from "pusher";
import type { PrismaClient } from "@thatrundown/prisma";
import { PusherEvents } from "@thatrundown/pusher";
export class VideoService {
  private videoFilePath: string;
  private audioFilePath: string;
  readonly MODEL = "whisper-1";
  readonly API_KEY = process.env.YOUTUBE_API_KEY;
  constructor(
    private readonly db: PrismaClient,
    private readonly youtube: typeof ytdl,
    private readonly ffmpeg: typeof Ffmpeg,
    private readonly socket: Pusher,
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

  private sanitizeFileName(fileName: string) {
    // remove spaces and special characters and replace them with underscores
    return fileName.replace(/[^a-zA-Z0-9]/g, "_");
  }

  public async getItemFromYoutube(
    info: ytdl.videoInfo,
    format: downloadOptions["format"],
    outputFilePath: string,
    userId: string,
    isAudio = false
  ): Promise<{ outputFilePath: string }> {
    // if the file already exists, return the path
    this.logger.info("Format chosen:", { format });

    if (!format?.approxDurationMs) {
      this.logger.error("Failed to get target duration:", { info });
      throw new Error(
        `[VideoService] Failed to get target duration from format: ${JSON.stringify(format)}`
      );
    }

    const progressStream = progress({
      length: Number.parseInt(format.contentLength),
      time: 1000,
    });

    progressStream.on("progress", async (progress) => {
      this.logger.info("Downloading video:", { progress });
      const eventToUse = isAudio
        ? PusherEvents.SummaryProgressAudio
        : PusherEvents.SummaryProgressVideo;
      await this.socket.trigger(`private-${userId}`, eventToUse, {
        progress: progress.percentage,
        videoId: info.videoDetails.videoId,
      });
    });
    const writeStream = fs.createWriteStream(outputFilePath);

    const command = this.youtube
      .downloadFromInfo(info, {
        format,
      })
      .pipe(progressStream)
      .pipe(writeStream);

    return await new Promise((resolve, reject) => {
      command.on("finish", () => resolve({ outputFilePath }));
      command.on("error", reject);
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

  public async getSummaryByVideoUrl(url: string, userId: string) {
    return await this.db.summary.findFirst({
      where: {
        video_url: url,
        user_id: userId,
      },
      include: {
        video: {
          include: {
            authors: true,
          },
        },
      },
    });
  }

  public async createFilesFromYoutubeUrl(
    url: string,
    userId: string
  ): Promise<{
    outputFilePath: string;
    audioFilePath: string;
    videoMetaData: ytdl.MoreVideoDetails;
  }> {
    const id = url.split("v=").pop() || url.split("/").pop();

    if (!id) {
      this.logger.error("Failed to extract video id from URL:", { url });
      throw new Error(
        `[VideoService] Failed to extract video id from URL, invalid URL: ${url}. Please provide a valid URL. Example: https://youtu.be/221F55VPp2M or https://www.youtube.com/watch?v=221F55VPp2M`
      );
    }

    // const resp = await this.getInfo(id).catch((error: Error) => {
    //   this.logger.error("Failed to fetch file:", { error });
    //   throw new Error(`[VideoService] Failed to fetch file: ${error.message}`);
    // })

    const resp = await this.youtube.getInfo(id).catch((error: Error) => {
      this.logger.error("Failed to fetch file:", { error });
      throw new Error(`[VideoService] Failed to fetch file: ${error.message}`);
    });

    const videoFormat = this.youtube.chooseFormat(resp.formats, {
      filter: "videoonly",
    });

    const audioFormat = this.youtube.chooseFormat(resp.formats, {
      filter: "audioonly",
    });

    // create the users directory
    fs.mkdirSync(userId, { recursive: true });

    const outputFilePath = path.join(
      userId,
      `video_${this.sanitizeFileName(resp.videoDetails.title)}.${videoFormat.container}`
    );
    const audioFilePath = path.join(
      userId,
      `audio_${this.sanitizeFileName(resp.videoDetails.title)}.${audioFormat.container}`
    );

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
        this.getItemFromYoutube(
          resp,
          videoFormat,
          outputFilePath,
          userId,
          false
        ),
        this.getItemFromYoutube(resp, audioFormat, audioFilePath, userId, true),
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

  public async extractFrames(
    filePath: string,
    userId: string
  ): Promise<string> {
    this.logger.info("Extracting frames:", { filePath });
    return new Promise((resolve, reject) => {
      // create a directory to store the frames

      const outputDir = path.join(
        `${userId}/frames`,
        this.slugifyPath(filePath)
      );
      fs.mkdirSync(outputDir, { recursive: true });
      // extract a frame every X seconds based on Y length of the video
      const command = this.ffmpeg(filePath)
        .on("start", (cmd) => this.logger.info({ cmd }))
        .outputOptions("-vf", "fps=1/60")
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

  public cleanup({ userId }: { userId: string }) {
    this.logger.info("Cleaning up:", { userId });
    // delete the /userId directory
    fs.rmSync(userId, { recursive: true });
  }
}
