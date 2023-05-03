import { useQuery } from "@tanstack/react-query";
import { api } from "../../api";

export const USE_POST_KEY = "USE_POST";

export function usePost(id?: number) {
  const { data, isLoading } = useQuery(
    [USE_POST_KEY, id],
    async () => {
      const [post, error] = await api.posts.getOne({ id: id! });
      if (error) {
        throw error;
      }
      return post;
    },
    {
      enabled: typeof id === "number",
    }
  );

  if (!id) {
    return {
      post: undefined,
      isLoading: false,
    };
  }
  return {
    post: data,
    isLoading,
  };
}
