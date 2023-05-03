import type { ApiGateway } from "../../types";
import { chatroomController } from "./chatroom.controller";

export const chatroomGateway = {
  authenticate: ["authenticate", chatroomController.gw_authenticate],
  deauthenticate: ["deauthenticate", chatroomController.gw_deauthenticate],
  sendMessage: ["sendMessage", chatroomController.gw_sendMessage],
} satisfies ApiGateway;
