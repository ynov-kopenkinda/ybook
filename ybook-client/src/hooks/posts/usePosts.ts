import { useInfiniteQuery } from "@tanstack/react-query";
import { api } from "../../api";

export const USE_POSTS_KEY = "USE_POSTS";

export const usePosts = ({ friendsOnly = false }) => {
  const fetchPosts = async ({ pageParam = 1 }) => {
    const [posts, error] = await api.posts.getAll({
      page: pageParam,
      friendsOnly,
    });
    if (error) {
      throw error;
    }
    return posts;
  };
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isInitialLoading,
  } = useInfiniteQuery([USE_POSTS_KEY, friendsOnly], fetchPosts, {
    getNextPageParam: (lastPage, pages) => {
      if (lastPage.page < lastPage.pages) return lastPage.page + 1;
      return false;
    },
  });
  return {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isInitialLoading,
  };
};
