import { useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "../../api";
import { USE_NOTIFICATIONS_KEY } from "../notifications/useNotifications";

export const USE_MESSAGES_KEY = "USE_MESSAGES";

export function useMessages({ chatroomId }: { chatroomId: number }) {
  const queryClient = useQueryClient();
  const { data, isLoading } = useQuery(
    [USE_MESSAGES_KEY, chatroomId],
    async () => {
      const [messages, error] = await api.chatrooms.getMessages({
        id: chatroomId,
      });
      if (error) {
        throw error;
      }
      return messages;
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries([USE_NOTIFICATIONS_KEY]);
      },
    }
  );
  return [data, isLoading] as const;
}
