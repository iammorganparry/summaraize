import { z } from "zod";

export const SummarySchema = z.object({
  title: z.string().describe("The title of the summary"),
  summaryFormatted: z.string().describe("The summary in HTML format, the summary should also include the chapters"),
  summary: z.string().describe("The summary in plain text, the summary should also include the chapters"),
  videoUrl: z.string().describe("The URL of the video"),
  thumbnailUrl: z.string().describe("The URL of the video thumbnail"),
  authors: z.array(z.string()).describe("The authors of the video"),
  createdAt: z.string().describe("The date the summary was created"),
  chapters: z
    .array(
      z.object({
        timestamp: z.string().describe("The timestamp of the chapter"),
        title: z.string().describe("The title of the chapter"),
        content: z.string().describe("The content of the chapter"),
      }),
    )
    .describe(`The chapters of the video.. heres is an example of chapters: 
    - Chapters -
    (0:00) Coming up
    (0:20) Intro
    (1:52) “A spot of trouble” - detained in Calgary
    (8:02) The film they don’t want you to see, headlines vs. reality
    (19:44) Lawfare waged against a journalist, paying off the witnesses
    (28:43) Being bankrupted by the court despite proving his claims
    (32:04) Worrying about consequence: “I failed as a journalist”
    (33:10) Unattended adult problems ruin the lives of innocent people and children
    `),
});
