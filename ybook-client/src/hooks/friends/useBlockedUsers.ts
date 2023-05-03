import { useQuery } from "@tanstack/react-query";
import { api } from "../../api";

export const USE_BLOCKED_USERS_KEY = "USE_BLOCKED_USERS";

export function useBlockedUsers() {
  const { data, isLoading } = useQuery([USE_BLOCKED_USERS_KEY], async () => {
    const [data, error] = await api.users.getBlocked();
    if (error) {
      throw error;
    }
    return data;
  });
  return [data?.blockedUsers ?? [], isLoading] as const;
}
