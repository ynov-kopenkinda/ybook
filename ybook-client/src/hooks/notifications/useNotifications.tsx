import { useQuery } from "@tanstack/react-query";
import { api } from "../../api";

export const USE_NOTIFICATIONS_KEY = () => "USE_NOTIFICATIONS";

export function useNotifications() {
  const { data, isLoading } = useQuery([USE_NOTIFICATIONS_KEY], async () => {
    const [notifications, error] = await api.notifications.get();
    if (error) {
      throw error;
    }
    return notifications;
  });
  return [data, isLoading] as const;
}
