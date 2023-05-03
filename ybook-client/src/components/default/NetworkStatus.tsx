import { useEffect, useState } from "react";

export function NetworkStatus() {
  const [onlineStatus, setOnlineStatus] = useState(true);

  useEffect(() => {
    window.addEventListener("offline", () => {
      setOnlineStatus(false);
    });
    window.addEventListener("online", () => {
      setOnlineStatus(true);
    });

    return () => {
      window.removeEventListener("offline", () => {
        setOnlineStatus(false);
      });
      window.removeEventListener("online", () => {
        setOnlineStatus(true);
      });
    };
  }, []);

  if (onlineStatus) {
    return null;
  }
  return (
    <div className="fixed top-2 right-2 animate-pulse rounded-full border border-red-300 bg-white p-2 font-black uppercase text-red-300">
      Offline
    </div>
  );
}
