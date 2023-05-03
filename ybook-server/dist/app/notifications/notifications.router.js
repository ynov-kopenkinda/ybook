"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.notificationsRouter = void 0;
const express_1 = require("express");
const notifications_controller_1 = require("./notifications.controller");
const error_middleware_1 = require("../_middlewares/error.middleware");
const session_middleware_1 = require("../_middlewares/session.middleware");
exports.notificationsRouter = (0, express_1.Router)();
exports.notificationsRouter.use((0, session_middleware_1.isAuthed)(true));
exports.notificationsRouter.get("/", (0, error_middleware_1.useApi)(notifications_controller_1.notificationsController.api_getNotifications));
//# sourceMappingURL=notifications.router.js.map