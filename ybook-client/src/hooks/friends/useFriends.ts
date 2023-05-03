import { useQuery } from "@tanstack/react-query";
import { api } from "../../api";

export const USE_FRIENDS_KEY = "USE_FRIENDS";

export const useFriends = () => {
  const { data, isLoading } = useQuery([USE_FRIENDS_KEY], async () => {
    const [data, error] = await api.friends.getAll();
    if (error) {
      throw error;
    }
    return data;
  });
  return [data, isLoading] as const;
};
