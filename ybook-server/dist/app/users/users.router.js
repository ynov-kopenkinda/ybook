"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userRouter = void 0;
const express_1 = require("express");
const users_controller_1 = require("./users.controller");
const error_middleware_1 = require("../_middlewares/error.middleware");
const session_middleware_1 = require("../_middlewares/session.middleware");
exports.userRouter = (0, express_1.Router)();
exports.userRouter.use((0, session_middleware_1.isAuthed)(true));
exports.userRouter.post("/change-avatar", (0, error_middleware_1.useApi)(users_controller_1.userController.api_changeAvatar));
exports.userRouter.post("/change-cover", (0, error_middleware_1.useApi)(users_controller_1.userController.api_changeCover));
exports.userRouter.get("/blocked", (0, error_middleware_1.useApi)(users_controller_1.userController.api_getBlockedUsers));
exports.userRouter.get("/:id", (0, error_middleware_1.useApi)(users_controller_1.userController.api_getDetails));
exports.userRouter.post("/:id/block", (0, error_middleware_1.useApi)(users_controller_1.userController.api_blockUser));
exports.userRouter.post("/:id/unblock", (0, error_middleware_1.useApi)(users_controller_1.userController.api_unblockUser));
//# sourceMappingURL=users.router.js.map