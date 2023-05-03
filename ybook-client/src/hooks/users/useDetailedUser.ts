import { useQuery } from "@tanstack/react-query";
import { api } from "../../api";
import { User } from "../../api/api.types";

export const USE_DETAILED_USER_KEY = "USE_DETAILED_USER";

export const useDetailedUser = ({ user }: { user: User }) => {
  const { data, isLoading } = useQuery(
    [USE_DETAILED_USER_KEY, user.id],
    async () => {
      const [userData, error] = await api.users.getOne({ id: user.id });
      if (error) {
        throw error;
      }
      return userData;
    },
    {}
  );
  return [data, isLoading] as const;
};
