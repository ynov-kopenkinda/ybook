import { Router } from "express";
import { friendsController } from "./friends.controller";
import { useApi } from "../_middlewares/error.middleware";
import { isAuthed } from "../_middlewares/session.middleware";

export const friendsRouter = Router();
friendsRouter.use(isAuthed(true));

friendsRouter.get("/", useApi(friendsController.api_getFriends));
friendsRouter.post("/", useApi(friendsController.api_sendOrAcceptFriendRequest));
friendsRouter.delete("/", useApi(friendsController.api_removeOrRejectFriendRequest));
friendsRouter.get("/suggested", useApi(friendsController.api_getSuggested));
friendsRouter.get("/global", useApi(friendsController.api_getOthers));
friendsRouter.get("/requests", useApi(friendsController.api_getFriendRequests));
