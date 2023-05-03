import { Router } from "express";
import { authController } from "./auth.controller";
import { useApi } from "../_middlewares/error.middleware";
import { isAuthed } from "../_middlewares/session.middleware";

export const authRouter = Router();

authRouter.get("/session", isAuthed(false), useApi(authController.api_getSession));
authRouter.post("/createUser", isAuthed(true), useApi(authController.api_createUser));
