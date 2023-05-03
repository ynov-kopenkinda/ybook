import { useQuery } from "@tanstack/react-query";
import { api } from "../../api";

export const USE_CONVERSATIONS_KEY = "USE_CONVERSATIONS";

export function useConversations() {
  const { data, isLoading } = useQuery([USE_CONVERSATIONS_KEY], async () => {
    const [conversations, error] = await api.chatrooms.getConversations();
    if (error) {
      throw error;
    }
    return conversations;
  });
  return [data, isLoading] as const;
}
