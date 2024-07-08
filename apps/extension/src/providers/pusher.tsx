import { useUser } from "@clerk/chrome-extension";
import type { Channel } from "pusher-js";
import { createContext, useContext, useMemo } from "react";
import { pusher } from "~lib/socket/pusher";

const PusherContext = createContext<Channel | null>(null);

export const usePusher = () => {
  const context = useContext(PusherContext);
  if (context === undefined) {
    throw new Error("usePusher must be used within a PusherProvider");
  }
  return context;
};

export const PusherProvider = ({ children }: { children: React.ReactNode }) => {
  const { user } = useUser();
  const userId = user?.id;

  const channel = useMemo(() => {
    if (!userId) {
      return null;
    }
    return pusher.subscribe(`private-${userId}`);
  }, [userId]);

  return <PusherContext.Provider value={channel}>{children}</PusherContext.Provider>;
};
