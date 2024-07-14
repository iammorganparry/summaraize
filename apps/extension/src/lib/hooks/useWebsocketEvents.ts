import { PusherEvents } from "@summaraize/pusher";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useRef } from "react";
import { getClerkJs } from "~lib/clerk/vanilla";
import type { Channel } from "pusher-js";
import { getPusher } from "~lib/socket/pusher";

const pusher = getPusher();
export const useWebsocketEvents = ({
  onSummaryProgress,
  onSummaryCompleted,
}: {
  onSummaryProgress: (data: { progress: number }) => void;
  onSummaryCompleted: () => void;
}) => {
  const { data: clerk } = useQuery({
    queryKey: ["clerk"],
    queryFn: () => getClerkJs(),
  });

  const channel = useRef<Channel | null>(null);
  useEffect(() => {
    if (clerk) {
      channel.current = pusher.subscribe(`private-${clerk.user?.id}`);
    }
  }, [clerk]);

  useEffect(() => {
    channel.current?.bind(PusherEvents.SummaryProgressVideo, onSummaryProgress);
    channel.current?.bind(PusherEvents.SummaryCompleted, onSummaryCompleted);

    return () => {
      channel.current?.unbind_all();
    };
  }, [onSummaryProgress, onSummaryCompleted]);
};
