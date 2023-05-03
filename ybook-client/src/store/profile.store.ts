import { create } from "zustand";
import { User } from "../api/api.types";

interface ProfileStore {
  user: User | null;
  setUser: (user: User | null) => void;
}

const profileStore = create<ProfileStore>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
}));

export const useProfilePopup = () => {
  const { user, setUser } = profileStore();
  const open = (user: User) => setUser(user);
  const close = () => setUser(null);
  return { user, open, close };
};
