"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.postsRouter = void 0;
const express_1 = require("express");
const posts_controller_1 = require("./posts.controller");
const error_middleware_1 = require("../_middlewares/error.middleware");
const session_middleware_1 = require("../_middlewares/session.middleware");
exports.postsRouter = (0, express_1.Router)();
exports.postsRouter.use((0, session_middleware_1.isAuthed)(true));
exports.postsRouter.get("/", (0, error_middleware_1.useApi)(posts_controller_1.postsController.api_getPosts));
exports.postsRouter.post("/", (0, error_middleware_1.useApi)(posts_controller_1.postsController.api_createPost));
exports.postsRouter.get("/:postId", (0, error_middleware_1.useApi)(posts_controller_1.postsController.api_getPost));
exports.postsRouter.post("/:postId/like", (0, error_middleware_1.useApi)(posts_controller_1.postsController.api_likePost));
exports.postsRouter.post("/:postId/reply", (0, error_middleware_1.useApi)(posts_controller_1.postsController.api_replyToPost));
//# sourceMappingURL=posts.router.js.map