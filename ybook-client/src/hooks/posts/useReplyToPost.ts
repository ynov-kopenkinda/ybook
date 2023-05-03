import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../../api";
import { USE_POST_KEY } from "./usePost";
import { USE_POSTS_KEY } from "./usePosts";

export function useReplyToPost(postId: number) {
  const queryClient = useQueryClient();
  const { error, isLoading, mutateAsync } = useMutation(api.posts.reply, {
    onSuccess: async () => {
      await Promise.allSettled([
        queryClient.invalidateQueries([USE_POSTS_KEY]),
        queryClient.invalidateQueries([USE_POST_KEY, postId]),
      ]);
    },
  });
  return { error, isLoading, mutateAsync };
}
