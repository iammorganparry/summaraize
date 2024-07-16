import { z } from "zod";

export const SummarySchema = z.object({
  title: z.string().describe("The title of the summary"),
  summaryFormatted: z
    .string()
    .describe(
      "The summary in HTML format, the summary should also include the chapters.. it should not include title, tags or channel info... only summary and chapters"
    ),
  summary: z
    .string()
    .describe(
      "The summary in plain text, the summary should also include the chapters"
    ),
  videoUrl: z.string().describe("The URL of the video"),
  thumbnailUrl: z.string().describe("The URL of the video thumbnail"),
  authors: z.array(z.string()).describe("The authors of the video"),
  createdAt: z.string().describe("The date the summary was created"),
  chapters: z.array(
    z.object({
      timestamp: z.string().describe("The timestamp of the chapter"),
      title: z.string().describe("The title of the chapter"),
      content: z.string().describe("The content of the chapter"),
    })
  ).describe(`The chapters of the video.. heres is an example of chapters: \n
    The chapters should be formatted as follows: (timestamp) Chapter title: Chapter content \n
    These are examples of chapters that you can create for the video. 
    The chapters should be based on the content of the video and should be formatted as follows: (timestamp) Chapter title: Chapter content and should adhere strictly to the duration of the video.
    `),
});
