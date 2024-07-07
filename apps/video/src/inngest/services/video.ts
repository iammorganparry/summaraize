import fs from "node:fs";
import type OpenAI from "openai";
import type { OpenAIError } from "openai/error";
import type winston from "winston";
import type Ffmpeg from "fluent-ffmpeg";
import type ytdl from "ytdl-core";
import progress from "progress-stream";
import path from "node:path";
import type { PrismaClient } from "@summaraize/prisma";

export class VideoService {
	readonly MODEL = "whisper-1";
	private readonly MAX_FRAMES = 5;
	constructor(
		private readonly db: PrismaClient,
		private readonly ai: OpenAI,
		private readonly youtube: typeof ytdl,
		private readonly ffmpeg: typeof Ffmpeg,
		private logger: winston.Logger,
	) {}

	// return the file path

	public async transcribe(filePath: string) {
		try {
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
		data: ytdl.videoInfo,
		outputFilePath: string,
		format: ytdl.videoFormat,
	): Promise<{ outputFilePath: string }> {
		return new Promise((resolve, reject) => {
			// if the file already exists, return the path

			const outputStream = fs.createWriteStream(outputFilePath);

			this.logger.info("Format chosen:", { format });

			if (!format.approxDurationMs) {
				this.logger.error("Failed to get target duration:", { format });
				throw new Error(
					`[VideoService] Failed to get target duration from format: ${JSON.stringify(
						format,
					)}`,
				);
			}
			const fileProgress = progress({
				// random magic number
				length: +format.contentLength,
			});

			fileProgress.on("progress", async (progress: progress.Progress) => {
				this.logger.info("Downloading file:", { progress });
				if (progress.percentage >= 100) {
					resolve({
						outputFilePath,
					});
					this.logger.info("Download completed:", { outputFilePath });
				}
			});

			this.youtube
				.downloadFromInfo(data, { format })
				.pipe(fileProgress)
				.pipe(outputStream)
				.on("error", (error: Error) => {
					this.logger.error("Failed to download file:", { error });
					reject(error);
				});
		});
	}

	public async createFilesFromYoutubeUrl(url: string): Promise<{
		outputFilePath: string;
		audioFilePath: string;
		videoMetaData: ytdl.videoInfo["videoDetails"];
	}> {
		const id = url.split("v=").pop() || url.split("/").pop();

		if (!id) {
			this.logger.error("Failed to extract video id from URL:", { url });
			throw new Error(
				`[VideoService] Failed to extract video id from URL, invalid URL: ${url}. Please provide a valid URL. Example: https://youtu.be/221F55VPp2M or https://www.youtube.com/watch?v=221F55VPp2M`,
			);
		}

		const resp = await this.youtube.getInfo(id).catch((error: Error) => {
			this.logger.error("Failed to fetch file:", { error });
			throw new Error(`[VideoService] Failed to fetch file: ${error.message}`);
		});
		const format = this.youtube.chooseFormat(resp.formats, {
			quality: "highestvideo",
			filter: "videoonly",
		});
		const audioFormat = this.youtube.chooseFormat(resp.formats, {
			quality: "highestaudio",
			filter: "audioonly",
		}); // high quality we only need audio

		const outputFilePath = `video-${this.sanitizeFileName(resp.videoDetails.title)}.${format.container}`;
		const audioFilePath = `audio-${this.sanitizeFileName(resp.videoDetails.title)}.${audioFormat.container}`;

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
				this.getItemFromYoutube(resp, outputFilePath, format),
				this.getItemFromYoutube(resp, audioFilePath, audioFormat),
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
		videoMetaData: ytdl.videoInfo["videoDetails"],
		transcription: string,
		framesDir: string,
	) {
		try {
			const frames = this.getImagesFromDir(framesDir);
			const frameMessages = frames.map((frame) => ({
				role: "user",
				content: `data:image/§jpeg;base64,${frame}`,
			}));
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
						content: `Here is the video information: 
            Title: ${videoMetaData.title}
            Description: ${videoMetaData.description}
            Channel: ${videoMetaData.author.name}
            Published At: ${videoMetaData.publishDate}
            Duration: ${videoMetaData.lengthSeconds}
            `,
					},
					{
						role: "user",
						content: `Here is the transcription of the video: ${transcription}`,
					},
					// @ts-expect-error -- this is valid!
					...frameMessages,
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
		summary,
		transcription,
		videoMetaData,
	}: {
		userId: string;
		summary: string;
		transcription: string;
		videoMetaData: ytdl.videoInfo["videoDetails"];
	}) {
		return await this.db.summary.create({
			data: {
				user: {
					connect: {
						id: userId,
					},
				},
				name: videoMetaData.title,
				summary,
				transcription,
				video: {
					create: {
						data_raw: JSON.stringify(videoMetaData),
						user_id: userId,
						name: videoMetaData.title,
						likes: videoMetaData.likes,
						duration: videoMetaData.lengthSeconds,
						thumbnail: videoMetaData.thumbnails[0].url,
						url: videoMetaData.video_url,
						views: videoMetaData.viewCount,
						authors: {
							create: {
								name: videoMetaData.author.name,
								avatar: videoMetaData.author.avatar,
								channel_url: videoMetaData.author.channel_url,
							},
						},
					},
				},
			},
		});
	}
}
