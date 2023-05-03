import { Router } from "express";
import { postsController } from "./posts.controller";
import { useApi } from "../_middlewares/error.middleware";
import { isAuthed } from "../_middlewares/session.middleware";

export const postsRouter = Router();

postsRouter.use(isAuthed(true));

postsRouter.get("/", useApi(postsController.api_getPosts));
postsRouter.post("/", useApi(postsController.api_createPost));
postsRouter.get("/:postId", useApi(postsController.api_getPost));
postsRouter.post("/:postId/like", useApi(postsController.api_likePost));
postsRouter.post("/:postId/reply", useApi(postsController.api_replyToPost));
