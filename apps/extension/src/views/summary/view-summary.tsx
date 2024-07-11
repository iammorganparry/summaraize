import { Box, Card, CardContent, CardMedia, Typography } from "@mui/material";
import dayjs from "dayjs";
import { api } from "~lib/trpc/react";
import { PageSkeleton } from "./skeleton";
import { childVariants } from "~utils";
import { motion } from "framer-motion";
import { Header } from "~components/header";
import { useParams } from "react-router-dom";

export const ViewSummary = () => {
  const params = useParams();
  console.log(params);
  const { data: summary, isLoading } =
    api.summary.getSummaryByVideoUrl.useQuery({
      url: params.videoUrl as string,
    });

  console.log(summary);

  if (isLoading || !summary) {
    return <PageSkeleton />;
  }

  return (
    <motion.div variants={childVariants} initial="initial" animate="final">
      <Header title="Summary" showBackBtn />
      <Card variant="elevation" elevation={0}>
        <CardMedia
          component="img"
          height="340"
          image={summary?.video.thumbnail}
          src="thumbnail"
        />
        <CardContent sx={{ gap: 1, display: "flex", flexDirection: "column" }}>
          <Typography variant="h1">{summary.name}</Typography>
          <Box sx={{ display: "flex", gap: 1 }}>
            <Typography variant="caption">
              {summary.video.authors.map((author) => author.name).join(", ")}
            </Typography>
            <Typography variant="caption">
              {dayjs(summary.created_at).fromNow()}
            </Typography>
          </Box>
          <div
            style={{ fontSize: "18px" }}
            // biome-ignore lint/security/noDangerouslySetInnerHtml: <explanation>
            dangerouslySetInnerHTML={{
              __html: summary.summary_html_formatted,
            }}
          />
        </CardContent>
      </Card>
    </motion.div>
  );
};
