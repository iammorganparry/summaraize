import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { getAuthToken } from "~lib/trpc/vanilla-client";

export const useGetAuthToken = (args?: {
  onTokenFetch: (token?: string | null) => void;
}) => {
  const data = useQuery({
    queryKey: ["get-token"],
    queryFn: getAuthToken,
    refetchOnWindowFocus: false,
    // every 5 minutes
    refetchInterval: 1000 * 60 * 5,
    retry: 3,
  });

  useEffect(() => {
    if (args?.onTokenFetch && data?.data) {
      args?.onTokenFetch(data?.data);
    }
  }, [data?.data, args?.onTokenFetch]);

  return data;
};
