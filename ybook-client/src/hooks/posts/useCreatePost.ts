import { useMutation } from "@tanstack/react-query";
import { api } from '../../api';

export const useCreatePost = () => {
  const { mutateAsync } = useMutation(api.posts.create)
  return mutateAsync;
};
