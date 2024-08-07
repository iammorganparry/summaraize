import type { XataClient } from "@thatrundown/xata";
import type winston from "winston";
import type { z } from "zod";
import type { SummarySchema } from "../schema/summary";
import type { AskResult, AskTableError } from "@xata.io/client";
import { PrismaVectorStore } from "@langchain/community/vectorstores/prisma";
import { OpenAIEmbeddings } from "@langchain/openai";
import { Prisma } from "@prisma/client";
import type { PrismaClient } from "@thatrundown/prisma";
import type ytdl from "@distube/ytdl-core";

export class XataService {
  constructor(
    private readonly client: XataClient,
    private readonly db: PrismaClient,
    private readonly logger: winston.Logger,
  ) {}

  get vectorStore() {
    return PrismaVectorStore.withModel(this.db).create(new OpenAIEmbeddings(), {
      prisma: Prisma,
      tableName: "Vectors",
      vectorColumnName: "embedding",
      columns: {
        id: PrismaVectorStore.IdColumn,
        content: PrismaVectorStore.ContentColumn,
      },
    });
  }

  public async deleteSummaryRequest(requestId: string) {
    return await this.client.db.SummaryRequest.delete({
      id: requestId,
    });
  }

  public async semanticSearch(input: string, userId: string) {
    return this.vectorStore.similaritySearch(input, 5, {
      user_id: {
        equals: userId,
      },
    });
  }

  get api() {
    return this.client;
  }

  public async askSummary(question: string, userId: string, sessionId?: string) {
    try {
      return await this.client.db.Summary.ask(question, {
        rules: [
          "When you give an example, this example must exist exactly in the context given.",
          'Only answer questions that are relating to the defined context. If asked about a question outside of the context, you can respond with "I can only answer questions about the summaries you have requested silly! 😜"',
          "Your name is Sandra, and you are a bot. But the best bot ever! 🤖",
        ],
        searchType: "keyword",
        sessionId,
        search: {
          fuzziness: 2,
          filter: {
            user_id: userId,
          },
          prefix: "phrase",
          target: ["summary", { column: "name", weight: 4 }, "transcription"],
        },
      });
    } catch (error) {
      this.logger.error("Failed to get summary from Xata:", { error });
      const err = error as AskTableError;
      if (err.status === 400 || err.status === 404) {
        return {
          answer: "I couldn't answer your question. Please try again later or ask a different question. 😔",
          records: [],
        } satisfies AskResult;
      }

      throw new Error(`[XataService] Failed to get summary from Xata: ${error}`);
    }
  }

  public async updateSummaryRequest(id: string, update: Prisma.SummaryRequestUpdateInput) {
    return await this.db.summaryRequest.update({
      where: {
        id,
      },
      data: update,
    });
  }

  public async saveSummary({
    userId,
    videoUrl,
    summary,
    transcription,
    videoMetaData,
  }: {
    userId: string;
    summary: z.infer<typeof SummarySchema>;
    videoUrl: string;
    transcription: string;
    videoMetaData: ytdl.MoreVideoDetails;
  }) {
    try {
      const content = `${transcription} \n ${summary.summary}`;

      const created = await this.db.$transaction(async (tx) => {
        const video = await tx.video.upsert({
          where: {
            url: videoUrl,
          },
          create: {
            id: videoMetaData.videoId,
            data_raw: JSON.stringify(videoMetaData),
            name: videoMetaData.title,
            duration: videoMetaData.lengthSeconds,
            thumbnail: videoMetaData?.thumbnails[0]?.url,
            url: videoUrl,
            user_id: userId,
            views: videoMetaData.viewCount,
            authors: {
              connectOrCreate: {
                where: {
                  channel_url: videoMetaData.author.channel_url,
                },
                create: {
                  name: videoMetaData.author.name,
                  avatar: "",
                  channel_url: videoMetaData.channelId || "",
                },
              },
            },
          },
          update: {},
        });

        const createdSummary = await tx.summary.create({
          data: {
            name: summary.title,
            summary: summary.summary,
            transcription,
            user_id: userId,
            video_url: videoUrl,
            summary_html_formatted: summary.summaryFormatted,
            updated_at: new Date().toISOString(),
            created_at: new Date().toISOString(),
            video_id: video.id,
          },
        });

        return createdSummary;
      });
      return await this.vectorStore.addModels(
        await this.db.$transaction([
          this.db.vectors.create({
            data: {
              content,
              user_id: userId,
              summary: {
                connect: {
                  id: created.id,
                },
              },
            },
          }),
        ]),
      );
    } catch (error) {
      const err = error as Prisma.PrismaClientKnownRequestError;
      this.logger.error("Failed to save summary:", { error });
      throw new Error(`[VideoService] Failed to save summary: ${err.message}`);
    }
  }
}
