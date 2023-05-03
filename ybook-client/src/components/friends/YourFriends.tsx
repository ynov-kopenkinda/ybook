import { useFriends } from "../../hooks/friends/useFriends";
import { ScrollabeUserList } from "./ScrollableUserList";

export function YourFriends({ search }: { search: string }) {
  const [friends, friendsLoading] = useFriends();
  const filteredFriends =
    friends?.filter((friend) =>
      `${friend.firstname}${friend.lastname}${friend.email}`
        .toLowerCase()
        .includes(search.toLowerCase())
    ) ?? [];

  return (
    <ScrollabeUserList
      title="Your friends"
      loading={friendsLoading}
      users={filteredFriends}
    />
  );
}
