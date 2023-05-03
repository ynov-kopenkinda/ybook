"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.startServer = exports.io = exports.server = exports.app = void 0;
const express = require("express");
const helmet_1 = require("helmet");
const cors = require("cors");
const http = require("http");
const socket_io_1 = require("socket.io");
const env_1 = require("./env");
const router_1 = require("./app/router");
const error_middleware_1 = require("./app/_middlewares/error.middleware");
const registerGateway_1 = require("./app/_utils/registerGateway");
const chatroom_gateway_1 = require("./app/chatroom/chatroom.gateway");
exports.app = express();
exports.server = http.createServer(exports.app);
exports.io = new socket_io_1.Server(exports.server, {
    cors: {
        origin: env_1.env.CLIENT_APP_URL,
    },
});
const startServer = () => {
    exports.io.on("connection", (socket) => {
        console.log("TODELETE: Socket connected", socket.id);
        (0, registerGateway_1.registerGateway)(socket, chatroom_gateway_1.chatroomGateway);
        socket.on("disconnect", () => {
            console.log("TODELETE: Socket disconnected", socket.id);
        });
    });
    exports.app.use((0, helmet_1.default)());
    exports.app.use(cors({
        origin: env_1.env.CLIENT_APP_URL,
    }));
    exports.app.use(express.json());
    exports.app.use(express.urlencoded({ extended: true }));
    exports.app.use("/api", router_1.appRouter);
    // write error handler here
    exports.app.use(error_middleware_1.notFoundMiddleware);
    exports.app.use(error_middleware_1.catchAllMiddleware);
    exports.server.listen(env_1.env.PORT, () => {
        console.log(`Server started on port ${env_1.env.PORT} :)`);
    });
};
exports.startServer = startServer;
//# sourceMappingURL=server.js.map