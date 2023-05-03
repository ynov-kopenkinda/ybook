import { useBlockedUsers } from "../../hooks/friends/useBlockedUsers";
import { ScrollabeUserList } from "./ScrollableUserList";

export function BlockedUsers() {
  const [blockedUsers, isLoading] = useBlockedUsers();
  if (blockedUsers?.length === 0) return null;
  return (
    <ScrollabeUserList
      title="Blocked Users"
      loading={isLoading}
      users={blockedUsers ?? []}
    />
  );
}
