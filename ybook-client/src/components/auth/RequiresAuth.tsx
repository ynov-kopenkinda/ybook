import { Navigate, Outlet } from "react-router";
import { useSession } from "../../hooks/auth/useSession";
import { AppLayout } from "../default/Layout";
import { CenterLoader } from "../default/Loader";


export const RequiresAuth = () => {
  const { status } = useSession();
  if (status === "error") {
    return <Navigate to={"/login"} />;
  }
  if (status === "loading") {
    return <CenterLoader />;
  }
  return (
    <AppLayout>
      <Outlet />
    </AppLayout>
  );
};
