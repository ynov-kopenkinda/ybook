import { IconBell, IconLogout } from "@tabler/icons-react";
import { useNavigate } from "react-router";
import { logout } from "../aws/cognito";
import { ProfileSettings } from "../components/settings/ProfileSettings";
import { useNotifications } from "../hooks/notifications/useNotifications";
import { useAuthActions } from "../store/auth.store";

export default function SettingsPage() {
  const navigate = useNavigate();
  const [notifications] = useNotifications();
  const { deauthenticate } = useAuthActions();
  return (
    <div className="flex flex-col gap-2">
      <h1 className="mb-4 text-4xl font-black">Settings</h1>
      <ProfileSettings />
      {notifications !== undefined && notifications.length > 0 && (
        <button
          className="flex items-center justify-center gap-2 rounded-md border border-blue-500 px-4 py-2 text-blue-500"
          onClick={() => {
            navigate("/notifications");
          }}
        >
          <IconBell />
          {notifications.length} new notification
          {notifications.length > 1 ? "s" : ""}
        </button>
      )}
      <button
        className="flex items-center justify-center gap-2 rounded-md border border-red-500 px-4 py-2 text-red-500"
        onClick={() => {
          logout();
          deauthenticate();
          navigate("/login");
        }}
      >
        <IconLogout />
        Logout
      </button>
    </div>
  );
}
