import { api } from "~lib/trpc/react";
import { ListSkeleton } from "./skeleton";
import { NoSummaries } from "./no-summaries";
import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Stack,
  Typography,
} from "@mui/material";
import { Header } from "~components/header";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

import { truncate } from "~utils";

dayjs.extend(relativeTime);
export const SummaryList = () => {
  const { data, isLoading } = api.summary.getLatest.useQuery({
    limit: 10,
  });

  return (
    <>
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
                boxShadow: (theme) => theme.shadows[2],
              }}
              key={`card-${window.crypto.randomUUID()}`}
            >
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
                <div
                  style={{ fontSize: "1.2rem" }}
                  // biome-ignore lint/security/noDangerouslySetInnerHtml: <explanation>
                  dangerouslySetInnerHTML={{
                    __html: summary.summary,
                  }}
                />
              </CardContent>
              <CardActions
                sx={{
                  display: "flex",
                  justifyContent: "flex-end",
                  gap: 1,
                }}
              >
                <Button variant="text">Delete</Button>
                <Button>View</Button>
              </CardActions>
            </Card>
          ))}
        </Stack>
      )}
    </>
  );
};
