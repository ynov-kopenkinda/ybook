"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.chatroomGateway = void 0;
const chatroom_controller_1 = require("./chatroom.controller");
exports.chatroomGateway = {
    authenticate: ["authenticate", chatroom_controller_1.chatroomController.gw_authenticate],
    deauthenticate: ["deauthenticate", chatroom_controller_1.chatroomController.gw_deauthenticate],
    sendMessage: ["sendMessage", chatroom_controller_1.chatroomController.gw_sendMessage],
};
//# sourceMappingURL=chatroom.gateway.js.map