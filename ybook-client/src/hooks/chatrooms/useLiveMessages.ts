import { useQueryClient } from "@tanstack/react-query";
import { Message } from "../../api/api.types";
import { useSocketClient } from "../../store/socketClient.store";
import { USE_NOTIFICATIONS_KEY } from "../notifications/useNotifications";

export const USE_LIVE_MESSAGES_KEY = "get-messages";

export function useLiveMessages({
  chatroomId,
  onReceive,
}: {
  chatroomId: number;
  onReceive: (message: Message) => void;
}) {
  const ioClient = useSocketClient();
  const queryClient = useQueryClient();

  ioClient.on(USE_LIVE_MESSAGES_KEY, (message: Message) => {
    onReceive(message);
    queryClient.invalidateQueries([USE_NOTIFICATIONS_KEY]);
  });
}
