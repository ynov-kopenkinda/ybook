import { Router } from "express";
import { notificationsController } from "./notifications.controller";
import { useApi } from "../_middlewares/error.middleware";
import { isAuthed } from "../_middlewares/session.middleware";

export const notificationsRouter = Router();
notificationsRouter.use(isAuthed(true));

notificationsRouter.get("/", useApi(notificationsController.api_getNotifications));
