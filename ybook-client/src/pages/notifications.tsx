import { IconEye } from "@tabler/icons-react";
import { Link } from "react-router-dom";
import { Notification as NotificationType } from "../api/api.types";
import { CenterLoader } from "../components/default/Loader";
import { useNotifications } from "../hooks/notifications/useNotifications";

export default function NotificationsPage() {
  const [notifications, areNotificationsLoading] = useNotifications();
  if (areNotificationsLoading) {
    return <CenterLoader />;
  }
  return (
    <div className="flex flex-col gap-2">
      <h1 className="mb-4 text-4xl font-black">Notifications</h1>
      {(notifications === undefined || notifications.length === 0) && (
        <p className="text-center">No new notifications</p>
      )}
      {notifications?.map((notification) => (
        <Notification key={notification.id} notification={notification} />
      ))}
    </div>
  );
}

function Notification({ notification }: { notification: NotificationType }) {
  const type = notification.friendshipId !== undefined ? "friend" : "message";
  return (
    <div className="flex items-center justify-between rounded-md border p-4">
      <p className="text-sm">
        {type === "message"
          ? "You've got a new message"
          : "You've got a new friend request"}
      </p>
      <Link to={type === "message" ? "/messages" : "/friends"}>
        <button className="rounded-sm bg-blue-400 p-2 text-white">
          <IconEye />
        </button>
      </Link>
    </div>
  );
}
