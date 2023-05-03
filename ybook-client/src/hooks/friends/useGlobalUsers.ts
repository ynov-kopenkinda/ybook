import { useQuery } from "@tanstack/react-query";
import { api } from "../../api";

export const USE_GLOBAL_USERS_KEY = "USE_GLOBAL_USERS";

export function useGlobalUsers(search: string) {
  const { data, isLoading } = useQuery(
    [USE_GLOBAL_USERS_KEY, search],
    async () => {
      const [data, error] = await api.users.getAll(search);
      if (error) {
        throw error;
      }
      return data;
    }
  );
  return [data, isLoading] as const;
}
