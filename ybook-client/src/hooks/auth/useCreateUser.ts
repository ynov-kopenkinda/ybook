import { useMutation } from "@tanstack/react-query";
import { api } from "../../api";

export const useCreateUser = () => {
  const { mutateAsync } = useMutation(() => api.auth.createUser());
  return mutateAsync;
};
