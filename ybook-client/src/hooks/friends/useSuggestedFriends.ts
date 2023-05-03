import { useQuery } from "@tanstack/react-query";
import { api } from '../../api';

export const USE_SUGGESTED_FRIENDS_KEY = "USE_SUGGESTED_FRIENDS";

export const useSuggestedFriends = () => {
  const { data, isLoading } = useQuery(
    [USE_SUGGESTED_FRIENDS_KEY],
    async () => {
      const [data, error] = await api.friends.getSuggested();
      if (error) {
        throw error;
      }
      return data;
    }
  );
  return [data, isLoading] as const;
};
