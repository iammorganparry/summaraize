import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { getAuthToken } from "~lib/trpc/vanilla-client";

export const useGetAuthToken = (args?: {
  onTokenFetch: (token?: string | null) => void;
}) => {
  const data = useQuery({
    queryKey: ["get-token", window.location.href],
    queryFn: getAuthToken,
    refetchOnWindowFocus: false,
    retry: false,
    // 1 hour
    cacheTime: 1000 * 60 * 60,
  });

  useEffect(() => {
    if (args?.onTokenFetch && data?.data) {
      args?.onTokenFetch(data?.data);
    }
  }, [data?.data, args?.onTokenFetch]);

  return data;
};
