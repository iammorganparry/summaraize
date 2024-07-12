import { describe, expect, it } from "vitest";
import { VideoService } from "../video";
import { db } from "@summaraize/prisma";
import { xata } from "../xata";
import ytdl from "@distube/ytdl-core";
import Ffmpeg from "fluent-ffmpeg";
import { pusher } from "@summaraize/pusher";
import { logger } from "../../lib/logger";
import { fa, faker } from "@faker-js/faker";
const service = new VideoService(db, xata, ytdl, Ffmpeg, pusher, logger);
describe("Video Service", () => {
  it("should save a summary", async () => {
    const summary = await service.saveSummary({
      embeddings: Array.from({ length: 1536 }, () => faker.number.float()),
      summary: {
        authors: ["Author 1", "Author 2"],
        createdAt: new Date().toISOString(),
        summary: "This is a summary",
        title: "Summary Title",
        summaryFormatted: "This is a formatted summary",
        thumbnailUrl: faker.internet.url(),
        videoUrl: faker.internet.url(),
      },
      userId: "user_2iuPh9T519gz50eUoP8MG21u08j",
      // @ts-expect-error -- not mocking all of it
      videoMetaData: {
        title: "Video Title",
        thumbnails: [
          {
            url: faker.internet.url(),
            width: 120,
            height: 90,
          },
        ],
        description: "Video Description",
        lengthSeconds: "120",
        author: {
          id: "author_2iuPh9T519gz50eUoP8MG21u08j",
          verified: true,
          name: "Author",
          avatar: faker.internet.url(),
          channel_url: faker.internet.url(),
        },
        age_restricted: false,
      },
      videoUrl: faker.internet.url(),
      transcription: "This is a transcription",
    });
    expect(summary).toBeDefined();
  });
});
