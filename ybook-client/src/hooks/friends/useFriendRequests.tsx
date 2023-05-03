import { useQuery } from "@tanstack/react-query";
import { api } from "../../api";

export const USE_FRIEND_REQUESTS_KEY = () => "USE_FRIEND_REQUESTS";

export function useFriendRequests() {
  const { data, isLoading } = useQuery([USE_FRIEND_REQUESTS_KEY], async () => {
    const [data, error] = await api.friends.getRequests();
    if (error !== null) {
      throw error;
    }
    return data;
  });
  return [data, isLoading] as const;
}
