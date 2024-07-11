import { z } from "zod";

export const SummarySchema = z.object({
  title: z.string().describe("The title of the summary"),
  summaryFormatted: z.string().describe("The summary in HTML format"),
  summary: z.string().describe("The summary in plain text"),
  videoUrl: z.string().describe("The URL of the video"),
  thumbnailUrl: z.string().describe("The URL of the video thumbnail"),
  authors: z.array(z.string()).describe("The authors of the video"),
  createdAt: z.string().describe("The date the summary was created"),
});
