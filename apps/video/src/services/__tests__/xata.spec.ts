import { describe, expect, it } from "vitest";
import { db } from "@thatrundown/prisma";

import { logger } from "../../lib/logger";
import { faker } from "@faker-js/faker";
import { xata } from "@thatrundown/xata";
import { XataService } from "../xata";

const service = new XataService(xata, db, logger);
describe("Xata Service", () => {
  it("should save a summary", async () => {
    const summary = await service.saveSummary({
      embeddings: Array.from({ length: 1536 }, () => faker.number.float()),
      summary: {
        chapters: [],
        authors: ["Author 1", "Author 2"],
        createdAt: new Date().toISOString(),
        summary: "This is a summary",
        title: "Summary Title",
        summaryFormatted: "This is a formatted summary",
        thumbnailUrl: faker.internet.url(),
        videoUrl: faker.internet.url(),
      },
      userId: "user_2iuPh9T519gz50eUoP8MG21u08j",
      videoMetaData: {
        allowRatings: true,
        channelId: "channelId",
        isCrawlable: true,
        isLiveContent: false,
        isOwnerViewing: false,
        isPrivate: false,
        isUnpluggedCorpus: false,
        keywords: ["keyword1", "keyword2"],
        videoId: "videoId",
        viewCount: "100",
        title: "Video Title",
        thumbnail: {
          thumbnails: [
            {
              url: faker.internet.url(),
              width: 120,
              height: 90,
            },
          ],
        },
        shortDescription: "Video Description",
        lengthSeconds: "120",
        // @ts-expect-error
        author: {
          channel_url: faker.internet.url(),
          name: "Author",
        },
      },
      videoUrl: faker.internet.url(),
      transcription: "This is a transcription",
    });
    expect(summary).toBeDefined();
  });
});
