import { create } from "zustand";
import { connect } from "socket.io-client";
import { env } from "../env";
import { authStore } from "./auth.store";

const wsServerUrl = new URL(env.REACT_APP_BACKEND_URL).origin.replace(
  "http",
  "ws"
);

const ioClient = connect(wsServerUrl);

ioClient.on("connect", () => {
  ioClient.emit("authenticate", { token: authStore.getState().token });
});

const socketClientStore = create<{ ioClient: typeof ioClient }>(() => ({
  ioClient,
}));

export const useSocketClient = () => socketClientStore.getState().ioClient;
