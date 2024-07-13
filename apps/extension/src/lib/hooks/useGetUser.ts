import { useQuery } from "@tanstack/react-query";
import { client } from "~lib/trpc/vanilla-client";

export const useGetUser = () => {
  return useQuery({
    queryKey: ["get-logged-in-user"],
    queryFn: () => client.user.getUser.query(),
  });
};
