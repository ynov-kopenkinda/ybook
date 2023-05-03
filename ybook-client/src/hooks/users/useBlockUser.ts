import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../../api";
import { USE_SESSION_KEY } from "../auth/useSession";
import { USE_BLOCKED_USERS_KEY } from "../friends/useBlockedUsers";
import { USE_FRIENDS_KEY } from "../friends/useFriends";
import { USE_DETAILED_USER_KEY } from "./useDetailedUser";

export function useBlockUser(userId: number) {
  const queryClient = useQueryClient();
  const { mutateAsync } = useMutation(api.users.block, {
    onSuccess: () => {
      Promise.allSettled([
        queryClient.invalidateQueries([USE_DETAILED_USER_KEY, userId]),
        queryClient.invalidateQueries([USE_SESSION_KEY]),
        queryClient.invalidateQueries([USE_FRIENDS_KEY]),
        queryClient.invalidateQueries([USE_BLOCKED_USERS_KEY]),
      ]);
    },
  });
  return mutateAsync;
}
