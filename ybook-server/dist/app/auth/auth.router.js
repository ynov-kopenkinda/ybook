"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authRouter = void 0;
const express_1 = require("express");
const auth_controller_1 = require("./auth.controller");
const error_middleware_1 = require("../_middlewares/error.middleware");
const session_middleware_1 = require("../_middlewares/session.middleware");
exports.authRouter = (0, express_1.Router)();
exports.authRouter.get("/session", (0, session_middleware_1.isAuthed)(false), (0, error_middleware_1.useApi)(auth_controller_1.authController.api_getSession));
exports.authRouter.post("/createUser", (0, session_middleware_1.isAuthed)(true), (0, error_middleware_1.useApi)(auth_controller_1.authController.api_createUser));
//# sourceMappingURL=auth.router.js.map