"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.friendsRouter = void 0;
const express_1 = require("express");
const friends_controller_1 = require("./friends.controller");
const error_middleware_1 = require("../_middlewares/error.middleware");
const session_middleware_1 = require("../_middlewares/session.middleware");
exports.friendsRouter = (0, express_1.Router)();
exports.friendsRouter.use((0, session_middleware_1.isAuthed)(true));
exports.friendsRouter.get("/", (0, error_middleware_1.useApi)(friends_controller_1.friendsController.api_getFriends));
exports.friendsRouter.post("/", (0, error_middleware_1.useApi)(friends_controller_1.friendsController.api_sendOrAcceptFriendRequest));
exports.friendsRouter.delete("/", (0, error_middleware_1.useApi)(friends_controller_1.friendsController.api_removeOrRejectFriendRequest));
exports.friendsRouter.get("/suggested", (0, error_middleware_1.useApi)(friends_controller_1.friendsController.api_getSuggested));
exports.friendsRouter.get("/global", (0, error_middleware_1.useApi)(friends_controller_1.friendsController.api_getOthers));
exports.friendsRouter.get("/requests", (0, error_middleware_1.useApi)(friends_controller_1.friendsController.api_getFriendRequests));
//# sourceMappingURL=friends.router.js.map