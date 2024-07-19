import { useQuery } from "@tanstack/react-query";
import { useEffect, useMemo } from "react";
import { getClerkJs } from "~lib/clerk/vanilla";
import { usePusherClient } from "./usePusherClient";
import type { SummaryStage } from "@thatrundown/prisma";

export const useWebsocketEvents = ({
  onSummaryProgress,
  onSummaryCompleted,
  onSummaryStep,
  onSummaryError,
}: {
  onSummaryError: (data: { error: string; videoId: string }) => void;
  onSummaryProgress: (data: { progress: number; videoId: string }) => void;
  onSummaryCompleted: (data: { step: SummaryStage; videoId: string }) => void;
  onSummaryStep: (data: { step: SummaryStage; videoId: string }) => void;
}) => {
  const { data: clerk } = useQuery({
    queryKey: ["clerk"],
    queryFn: () => getClerkJs(),
  });

  const userId = clerk?.user?.id;

  const { data: pusher } = usePusherClient();
  const channel = useMemo(() => {
    if (!userId || !pusher) {
      return null;
    }
    return pusher.subscribe(`private-${userId}`);
  }, [userId, pusher]);

  useEffect(() => {
    channel?.bind("summary.step", onSummaryStep);
    channel?.bind("summary.progress.video", onSummaryProgress);
    channel?.bind("summary.completed", onSummaryCompleted);
    channel?.bind("summary.error", onSummaryError);
  }, [onSummaryProgress, onSummaryCompleted, channel, onSummaryStep, onSummaryError]);
};
