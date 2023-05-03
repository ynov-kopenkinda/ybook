import { PropsWithChildren } from "react";
import { AppNavbar } from "./Navbar";
import { NetworkStatus } from "./NetworkStatus";
import { ProfilePreview } from "./ProfilePreview";

export function AppLayout({ children }: PropsWithChildren) {
  return (
    <>
      <main className="flex min-h-screen flex-col p-2 pb-24">{children}</main>
      <NetworkStatus />
      <AppNavbar />
      <ProfilePreview />
    </>
  );
}
