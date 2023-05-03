"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.s3uploadRouter = void 0;
const express_1 = require("express");
const s3_controller_1 = require("./s3.controller");
const error_middleware_1 = require("../_middlewares/error.middleware");
const session_middleware_1 = require("../_middlewares/session.middleware");
exports.s3uploadRouter = (0, express_1.Router)();
exports.s3uploadRouter.use((0, session_middleware_1.isAuthed)(true));
exports.s3uploadRouter.get("/upload", (0, error_middleware_1.useApi)(s3_controller_1.s3Controller.api_sendToS3));
exports.s3uploadRouter.get("/image", (0, error_middleware_1.useApi)(s3_controller_1.s3Controller.api_getFromS3));
//# sourceMappingURL=s3.router.js.map