import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { env } from "../env";

export interface AuthStore {
  token: string | undefined;
  email: string | undefined;
  authenticate: ({ email, token }: { email: string; token: string }) => void;
  deauthenticate: () => void;
}

export const authStore = create(
  persist<AuthStore>(
    (set) => ({
      token: undefined,
      email: undefined,
      authenticate: ({ email, token }) => set({ email, token }),
      deauthenticate: () => set({ token: undefined, email: undefined }),
    }),
    {
      name: "ybook-auth",
      storage: createJSONStorage(() =>
        env.NODE_ENV === "production" ? localStorage : sessionStorage
      ),
    }
  )
);

export const useAuth = () => {
  const token = authStore((state) => state.token);
  const email = authStore((state) => state.email);
  return { token, email };
};

// I don't like this approach, but it has to do for now (It forces a re-render on session refresh)
export const __private__useSetToken = () => {
  const [set, email] = authStore((state) => [state.authenticate, state.email]);
  return (token: string) => set({ email: email!, token });
};

export const useAuthActions = () => {
  const authenticate = authStore((state) => state.authenticate);
  const deauthenticate = authStore((state) => state.deauthenticate);
  return { authenticate, deauthenticate };
};
