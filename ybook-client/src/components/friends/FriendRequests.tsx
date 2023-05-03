import { useFriendRequests } from "../../hooks/friends/useFriendRequests";
import { ScrollabeUserList } from "./ScrollableUserList";

export const FriendRequests = () => {
  const [friendRequests, isFriendRequestsLoading] = useFriendRequests();
  if (friendRequests?.length === 0) return null;
  return (
    <ScrollabeUserList
      title="Friend Requests"
      loading={isFriendRequestsLoading}
      users={friendRequests ?? []}
    />
  );
};
