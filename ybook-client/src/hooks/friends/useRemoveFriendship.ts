import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../../api";
import { USE_DETAILED_USER_KEY } from "../users/useDetailedUser";
import { USE_FRIEND_REQUESTS_KEY } from "./useFriendRequests";
import { USE_FRIENDS_KEY } from "./useFriends";
import { USE_SUGGESTED_FRIENDS_KEY } from "./useSuggestedFriends";

export function useRemoveFriendship({ userId }: { userId: number }) {
  const queryClient = useQueryClient();
  const { mutateAsync } = useMutation(
    () => api.friends.cancel({ friendId: userId }),
    {
      onSuccess: async () => {
        await Promise.allSettled([
          queryClient.invalidateQueries([USE_FRIENDS_KEY]),
          queryClient.invalidateQueries([USE_SUGGESTED_FRIENDS_KEY]),
          queryClient.invalidateQueries([USE_FRIEND_REQUESTS_KEY]),
          queryClient.invalidateQueries([USE_DETAILED_USER_KEY, userId]),
        ]);
      },
    }
  );
  return mutateAsync;
}
