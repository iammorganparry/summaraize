import { z } from "zod";

export const responseSummarySchema = z.object({
  loading: z.boolean(),
  message: z.string().optional(),
  errors: z
    .array(
      z.object({
        message: z.string(),
        code: z.string(),
      }),
    )
    .optional(),
});

export type ResponseBody = z.infer<typeof responseSummarySchema>;

export const requestSummarySchema = z.object({
  videoId: z.string(),
});

export type RequestBody = z.infer<typeof requestSummarySchema>;
