import type { Socket } from "socket.io";
import { ApiError } from "../_middlewares/error.middleware";
import type { getSessionFromToken } from "../_middlewares/session.middleware";

export const connectionPool = new Map<
  Socket["id"],
  Awaited<ReturnType<typeof getSessionFromToken>>["email"]
>();

export const getConnection = (socketId: Socket["id"]) => {
  const email = connectionPool.get(socketId);
  if (!email) {
    throw new ApiError(401, "Unauthorized");
  }
  return email;
};
