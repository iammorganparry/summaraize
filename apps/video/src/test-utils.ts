import type { Summary } from "@prisma/client";
import { faker } from "@faker-js/faker";

export const generateSummary = (
  overrides: Partial<Summary>,
): Omit<Summary, "xata_id" | "xata_createdat" | "xata_updatedat" | "id" | "xata_version"> => ({
  created_at: faker.date.recent(),
  updated_at: faker.date.recent(),
  name: faker.lorem.words(),
  summary: faker.lorem.paragraphs(),
  summary_html_formatted: faker.lorem.paragraphs(),
  transcription: faker.lorem.paragraphs(),
  user_id: faker.string.uuid(),
  video_id: faker.string.uuid(),
  video_url: faker.internet.url(),

  ...overrides,
});
