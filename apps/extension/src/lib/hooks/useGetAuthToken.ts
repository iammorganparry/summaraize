import { useQuery } from "@tanstack/react-query";
import { getAuthToken } from "~lib/trpc/vanilla-client";

export const useGetAuthToken = () => {
  return useQuery({
    queryKey: ["get-token"],
    queryFn: getAuthToken,
  });
};
