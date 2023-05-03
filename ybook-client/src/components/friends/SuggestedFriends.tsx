import { useSuggestedFriends } from "../../hooks/friends/useSuggestedFriends";
import { ScrollabeUserList } from "./ScrollableUserList";

export function SuggestedFriends() {
  const [suggestedFriends, suggestedFriendsLoading] = useSuggestedFriends();
  return (
    <ScrollabeUserList
      title="Suggested"
      loading={suggestedFriendsLoading}
      users={suggestedFriends ?? []}
    />
  );
}
