import { Box, Card, CardActions, CircularProgress, Stack, Typography } from "@mui/material";
import type { SummaryRequest } from "@thatrundown/prisma";
import { Calendar } from "@untitled-ui/icons-react";
import dayjs from "dayjs";
import { useCallback } from "react";
import { toast } from "sonner";
import { OutlinedButton } from "~components/buttons/outlined";
import { SmallChip } from "~components/chips";
import { Header } from "~components/header";
import { api } from "~lib/trpc/react";
import { ListSkeleton } from "~views/summary/skeleton";

export const RequestListPage = () => {
  const { data: requests, isLoading, refetch } = api.summary.getSummaryRequests.useQuery();

  const { mutateAsync: cancelRequest, isLoading: isDeleting } = api.summary.cancelSummary.useMutation({
    onSuccess: () => {
      toast.success("Request cancelled successfully 👍");
      refetch();
    },
    onError: () => {
      toast.error("Failed to cancel request 😢");
    },
  });

  const handleCancelRequest = useCallback(
    (request: SummaryRequest) => async () => {
      await cancelRequest({ requestId: request.id });
    },
    [cancelRequest],
  );

  if (isLoading) {
    return <ListSkeleton />;
  }

  return (
    <>
      <Header title="Recent requests" />
      <Stack p={2} gap={1}>
        {requests?.map((request) => (
          <Card key={request.id} sx={{ p: 2 }}>
            <Box>
              <Typography variant="h4">{request.name}</Typography>
            </Box>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 2,
              }}
            >
              <SmallChip label={request.stage} />
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <Calendar style={{ width: 12 }} />
                <Typography variant="caption">{dayjs(request.created_at).format("MMM DD, YYYY")}</Typography>
              </Box>
            </Box>
            <CardActions
              sx={{
                display: "flex",
                justifyContent: "flex-end",
                gap: 2,
                marginTop: 2,
              }}
            >
              {request.stage !== "DONE" && (
                <OutlinedButton
                  disabled={isLoading}
                  endIcon={isDeleting ? <CircularProgress size={12} /> : null}
                  onClick={handleCancelRequest(request)}
                >
                  Cancel
                </OutlinedButton>
              )}
            </CardActions>
          </Card>
        ))}
      </Stack>
    </>
  );
};
