import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../../api";
import { USE_SESSION_KEY } from "../auth/useSession";
import { USE_CONVERSATION_KEY } from "../chatrooms/useConversation";
import { USE_CONVERSATIONS_KEY } from "../chatrooms/useConversations";
import { USE_POSTS_KEY } from "../posts/usePosts";
import { USE_DETAILED_USER_KEY } from "./useDetailedUser";

export function useChangeImage(type: "avatar" | "cover" = "avatar") {
  const queryClient = useQueryClient();
  const { mutateAsync } = useMutation(
    ({ s3key }: { s3key: string }) => api.settings.changeImage({ s3key, type }),
    {
      onSuccess: async (res) => {
        const [data, error] = res;
        if (error) {
          return;
        }
        await Promise.allSettled([
          queryClient.invalidateQueries([USE_SESSION_KEY]),
          queryClient.invalidateQueries([USE_POSTS_KEY]),
          queryClient.invalidateQueries([USE_DETAILED_USER_KEY, data.user.id]),
          queryClient.invalidateQueries([USE_CONVERSATIONS_KEY]),
          queryClient.invalidateQueries([USE_CONVERSATION_KEY, data.user.id]),
        ]);
      },
    }
  );
  return mutateAsync;
}
