import { useQuery } from "@tanstack/react-query";
import { getPusher } from "~lib/socket/pusher";

export const usePusherClient = () => {
  return useQuery({
    queryKey: ["pusher"],
    queryFn: getPusher,
  });
};
