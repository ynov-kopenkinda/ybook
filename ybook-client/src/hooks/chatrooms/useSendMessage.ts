import { useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { ApiGetMessagesResponse } from "../../api/api.types";
import { useSocketClient } from "../../store/socketClient.store";
import { USE_MESSAGES_KEY } from "./useMessages";

export function useSendMessage({ conversationId }: { conversationId: number }) {
  const ioClient = useSocketClient();
  const queryClient = useQueryClient();
  useEffect(() => {
    ioClient.on(
      "sendMessage",
      async (message: ApiGetMessagesResponse[number]) => {
        await queryClient.cancelQueries([USE_MESSAGES_KEY, conversationId]);
        await queryClient.invalidateQueries([USE_MESSAGES_KEY, conversationId]);
      }
    );
  }, [conversationId, ioClient, queryClient]);
  return (content: string) => {
    ioClient.emit("sendMessage", { conversationId, content });
  };
}
