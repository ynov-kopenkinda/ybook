import { useQuery } from "@tanstack/react-query";
import { api } from "../../api";

const USE_AVATAR_KEY = "USE_AVATAR";

export function useS3Image(s3key: string | null) {
  const { data } = useQuery(
    [USE_AVATAR_KEY, s3key],
    async () => {
      const [data, error] = await api.s3.getResourceUrl({ s3key: s3key! });
      if (error) {
        throw error;
      }
      return data;
    },
    {
      enabled: typeof s3key === "string",
    }
  );
  return data?.url;
}
