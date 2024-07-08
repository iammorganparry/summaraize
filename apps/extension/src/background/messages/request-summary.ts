import type { PlasmoMessaging } from "@plasmohq/messaging";
import type { AppRouter } from "@summaraize/trpc";
import type { TRPCClientError } from "@trpc/client";
import { z } from "zod";
import { client } from "~lib/trpc/vanilla-client";

const requestSummarySchema = z.object({
  videoId: z.string(),
});

export type RequestBody = z.infer<typeof requestSummarySchema>;

const responseSummarySchema = z.object({
  loading: z.boolean(),
  message: z.string().optional(),
  errors: z
    .array(
      z.object({
        message: z.string(),
        code: z.string(),
      })
    )
    .optional(),
});

export type ResponseBody = z.infer<typeof responseSummarySchema>;

const handler: PlasmoMessaging.MessageHandler<
  RequestBody,
  ResponseBody
> = async (req, res) => {
  try {
    const valid = requestSummarySchema.safeParse(req.body);

    if (!valid.success) {
      return res.send({ loading: false, errors: valid.error.errors });
    }

    await client.summary.requestSummary.mutate({
      videoId: valid.data.videoId,
    });

    res.send({
      loading: false,
    });
  } catch (error) {
    console.error("[request-summary] error", error);
    const err = error as TRPCClientError<AppRouter>;
    res.send({
      loading: false,
      errors: [{ message: err.message, code: err.cause?.name ?? "" }],
    });
  }
};

export default handler;
