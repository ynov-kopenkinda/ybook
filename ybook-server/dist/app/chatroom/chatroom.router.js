"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.chatroomRouter = void 0;
const express_1 = require("express");
const chatroom_controller_1 = require("./chatroom.controller");
const error_middleware_1 = require("../_middlewares/error.middleware");
const session_middleware_1 = require("../_middlewares/session.middleware");
exports.chatroomRouter = (0, express_1.Router)();
exports.chatroomRouter.use((0, session_middleware_1.isAuthed)(true));
exports.chatroomRouter.get("/", (0, error_middleware_1.useApi)(chatroom_controller_1.chatroomController.api_getConversations));
exports.chatroomRouter.post("/", (0, error_middleware_1.useApi)(chatroom_controller_1.chatroomController.api_startConversation));
exports.chatroomRouter.get("/:id/messages", (0, error_middleware_1.useApi)(chatroom_controller_1.chatroomController.api_getMessages));
exports.chatroomRouter.get("/:id", (0, error_middleware_1.useApi)(chatroom_controller_1.chatroomController.api_getConversation));
//# sourceMappingURL=chatroom.router.js.map