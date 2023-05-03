import { useQuery } from "@tanstack/react-query";
import { api } from "../../api";

export const USE_CONVERSATION_KEY = "USE_CONVERSATION";

export function useConversation(id: number | null) {
  const { data, isLoading } = useQuery(
    [USE_CONVERSATION_KEY, id],
    async () => {
      const [conversations, error] = await api.chatrooms.getConversation({
        id: id!,
      });
      if (error) {
        throw error;
      }
      return conversations;
    },
    {
      enabled: typeof id === "number",
    }
  );
  return [data, isLoading] as const;
}
