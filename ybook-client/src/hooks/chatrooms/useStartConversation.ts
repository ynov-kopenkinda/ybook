import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../../api";
import { USE_CONVERSATIONS_KEY } from "./useConversations";

export function useStartConversation(withUserId: number) {
  const queryClient = useQueryClient();
  const { mutateAsync } = useMutation(
    () => api.chatrooms.startConversation({ withUserId }),
    {
      onSuccess: async () => {
        await Promise.allSettled([
          queryClient.invalidateQueries([USE_CONVERSATIONS_KEY]),
        ]);
      },
    }
  );
  return mutateAsync;
}
