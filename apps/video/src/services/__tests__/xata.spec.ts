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
