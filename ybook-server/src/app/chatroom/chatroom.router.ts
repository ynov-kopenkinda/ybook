import { Router } from "express";
import { chatroomController } from "./chatroom.controller";
import { useApi } from "../_middlewares/error.middleware";
import { isAuthed } from "../_middlewares/session.middleware";

export const chatroomRouter = Router();
chatroomRouter.use(isAuthed(true));

chatroomRouter.get("/", useApi(chatroomController.api_getConversations));
chatroomRouter.post("/", useApi(chatroomController.api_startConversation));
chatroomRouter.get("/:id/messages", useApi(chatroomController.api_getMessages));
chatroomRouter.get("/:id", useApi(chatroomController.api_getConversation));
