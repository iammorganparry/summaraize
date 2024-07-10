import { api } from "~lib/trpc/react";
import { ListSkeleton } from "./skeleton";
import { NoSummaries } from "./no-summaries";
import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Container,
  Stack,
  Typography,
} from "@mui/material";
import { Header } from "~components/header";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
// import Markdown from "react-markdown";

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
              <CardContent>
                <Typography variant="h3">{summary.name}</Typography>
                <Typography variant="caption">
                  {summary.video.authors
                    .map((author) => author.name)
                    .join(", ")}
                </Typography>

                <Typography variant="caption">
                  {dayjs(summary.created_at).fromNow()}
                </Typography>

                {/* <Markdown>{summary.summary}</Markdown> */}
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
