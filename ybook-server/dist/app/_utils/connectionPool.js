"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getConnection = exports.connectionPool = void 0;
const error_middleware_1 = require("../_middlewares/error.middleware");
exports.connectionPool = new Map();
const getConnection = (socketId) => {
    const email = exports.connectionPool.get(socketId);
    if (!email) {
        throw new error_middleware_1.ApiError(401, "Unauthorized");
    }
    return email;
};
exports.getConnection = getConnection;
//# sourceMappingURL=connectionPool.js.map