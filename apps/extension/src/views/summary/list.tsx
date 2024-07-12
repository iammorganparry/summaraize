import { api } from "~lib/trpc/react";
import { ListSkeleton } from "./skeleton";
import { NoSummaries } from "./no-summaries";
import {
  Box,
  Button,
  Card,
  CardActionArea,
  CardActions,
  CardContent,
  CardMedia,
  IconButton,
  Stack,
  Typography,
} from "@mui/material";
import { Header } from "~components/header";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

import { childVariants } from "~utils";
import { useCallback } from "react";
import type { Prisma } from "@summaraize/prisma";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { LoadingButton } from "~components/buttons/loading";
import { OutlinedButton } from "~components/buttons/outlined";
import { Trash01 } from "@untitled-ui/icons-react";

dayjs.extend(relativeTime);
export const SummaryList = () => {
  const { data, isLoading, refetch } = api.summary.getLatest.useQuery({
    limit: 10,
  });

  const { mutateAsync: deleteSummary, isLoading: isDeleting } =
    api.summary.deleteSummary.useMutation({
      onError: (error) => {
        console.error(error);
        toast.error(
          "Failed to delete summary.. please try again, if the issue persists contact support 😰"
        );
      },
      onSuccess: () => {
        toast.success("Summary deleted successfully 😅");
      },
    });
  const utils = api.useUtils();

  const navigate = useNavigate();

  const handleDeleteSummary = useCallback(
    (summary: Prisma.SummaryGetPayload<{ include: { video: true } }>) =>
      async (e: React.MouseEvent) => {
        e.stopPropagation();
        await deleteSummary({ url: summary.video_url });
        await refetch();
      },
    [deleteSummary, refetch]
  );

  const handleViewSummary = useCallback(
    (
      summary: Prisma.SummaryGetPayload<{
        include: { video: { include: { authors: true } } };
      }>
    ) =>
      () => {
        utils.summary.getSummaryByVideoUrl.setData(
          { url: summary.video_url },
          summary,
          {
            updatedAt: Date.now(),
          }
        );
        navigate(`/summary/${window.encodeURIComponent(summary.video_url)}`);
      },
    [navigate, utils.summary.getSummaryByVideoUrl]
  );

  return (
    <motion.div variants={childVariants} initial="initial" animate="final">
      <Header title="Your Summaries" />
      {isLoading && <ListSkeleton />}
      {data?.length === 0 ? (
        <NoSummaries />
      ) : (
        <Stack gap={2} sx={{ px: 1 }}>
          {data?.map((summary) => (
            <Card
              variant="outlined"
              elevation={0}
              sx={{
                display: "flex",
                flexDirection: "column",
                border: "none",
                pb: 1,
                boxShadow: (theme) => theme.shadows[2],
              }}
              key={`card-${window.crypto.randomUUID()}`}
            >
              <CardActionArea onClick={handleViewSummary(summary)}>
                <CardMedia
                  component="img"
                  height="140"
                  image={summary.video.thumbnail}
                  src="thumbnail"
                />
                <CardContent
                  sx={{ gap: 1, display: "flex", flexDirection: "column" }}
                >
                  <Typography variant="h3">{summary.name}</Typography>
                  <Box sx={{ display: "flex", gap: 1 }}>
                    <Typography variant="caption">
                      {summary.video.authors
                        .map((author) => author.name)
                        .join(", ")}
                    </Typography>
                    <Typography variant="caption">
                      {dayjs(summary.created_at).fromNow()}
                    </Typography>
                  </Box>
                </CardContent>
                <CardActions
                  sx={{
                    display: "flex",
                    justifyContent: "flex-end",
                    gap: 1,
                  }}
                >
                  <LoadingButton
                    sx={{
                      borderRadius: 0,
                      width: 30,
                      background: (theme) => theme.palette.error.main,
                      color: (theme) => theme.palette.common.white,
                      boxShadow: (theme) => theme.shadows[1],
                      height: 30,
                    }}
                    loading={isDeleting}
                    onClick={handleDeleteSummary(summary)}
                  >
                    <Trash01 />
                  </LoadingButton>
                </CardActions>
              </CardActionArea>
            </Card>
          ))}
        </Stack>
      )}
    </motion.div>
  );
};
