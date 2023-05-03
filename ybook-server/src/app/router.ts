import { Router } from "express";
import { authRouter } from "./auth/auth.router";
import { chatroomRouter } from "./chatroom/chatroom.router";
import { friendsRouter } from "./friends/friends.router";
import { notificationsRouter } from "./notifications/notifications.router";
import { postsRouter } from "./posts/posts.router";
import { s3uploadRouter } from "./s3/s3.router";
import { userRouter } from "./users/users.router";

export const appRouter = Router();

appRouter.use("/auth", authRouter);
appRouter.use("/posts", postsRouter);
appRouter.use("/friends", friendsRouter);
appRouter.use("/notifications", notificationsRouter);
appRouter.use("/users", userRouter);
appRouter.use("/s3", s3uploadRouter);
appRouter.use("/chatrooms", chatroomRouter);
