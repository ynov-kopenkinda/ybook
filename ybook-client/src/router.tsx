import { createHashRouter, RouterProvider } from "react-router-dom";
import { refreshSession } from "./aws/cognito";
import { RedirectOnAuth } from "./components/auth/RedirectOnAuth";
import { RequiresAuth } from "./components/auth/RequiresAuth";
import { AppLayout } from "./components/default/Layout";
import { useInterval } from "./hooks/utils/useInterval";
import ForgotPasswordPage from "./pages/forgot-password";
import FriendsPage from "./pages/friends";
import HomePage from "./pages/home";
import LoginPage from "./pages/login";
import MessagesPage from "./pages/messages";
import ConversationPage from "./pages/messages/[id]";
import NewPostPage from "./pages/new-post";
import NotificationsPage from "./pages/notifications";
import PostPage from "./pages/post/[id]";
import RegisterPage from "./pages/register";
import SettingsPage from "./pages/settings";
import VerifyCodePage from "./pages/verify-code";
import { authStore, __private__useSetToken } from "./store/auth.store";

const router = createHashRouter([
  {
    element: <RequiresAuth />,
    children: [
      { path: "/", element: <HomePage /> },
      {
        path: "/post/:id",
        element: <PostPage />,
      },
      {
        path: "/new-post",
        element: <NewPostPage />,
      },
      {
        path: "/friends",
        element: <FriendsPage />,
      },
      {
        path: "/settings",
        element: <SettingsPage />,
      },
      {
        path: "/notifications",
        element: <NotificationsPage />,
      },
      {
        path: "/messages",
        element: <MessagesPage />,
      },
      {
        path: "/messages/:id",
        element: <ConversationPage />,
      },
    ],
  },
  {
    element: <RedirectOnAuth />,
    children: [
      {
        path: "/login",
        element: <LoginPage />,
      },
      {
        path: "/register",
        element: <RegisterPage />,
      },
      {
        path: "/forgot-password",
        element: <ForgotPasswordPage />,
      },
      {
        path: "/verify-code",
        element: <VerifyCodePage />,
      },
    ],
  },
  {
    path: "*",
    element: (
      <AppLayout>
        <h1 className="mt-20 text-center text-8xl font-black">404</h1>
      </AppLayout>
    ),
  },
]);

// Weird ass transition implementation lmao
router.subscribe((location) => {
  const root = document.querySelector("#root > main") as HTMLDivElement;
  if (!root) return;
  root.classList.add("opacity-0");
  root.classList.remove("opacity-100", "transition-opacity", "duration-500");
  setTimeout(() => {
    root.classList.add("opacity-100", "transition-opacity", "duration-500");
    root.classList.remove("opacity-0");
  }, 0);
});

const FIVTEEN_MINUTES = 1_000 * 60 * 15;

const AppRouter = () => {
  const setToken = __private__useSetToken();
  useInterval(() => {
    refreshSession().then((token) => {
      if (!token) return;
      setToken(token.getIdToken().getJwtToken());
    });
  }, FIVTEEN_MINUTES);
  return <RouterProvider router={router} />;
};

export default AppRouter;
