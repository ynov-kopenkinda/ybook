import type { Socket } from "socket.io";
import type { ApiGateway } from "../../types";
import { useGateway } from "../_middlewares/error.middleware";

export function registerGateway(socket: Socket, gateway: ApiGateway) {
  for (const [event, handler] of Object.values(gateway)) {
    const _handler = useGateway(handler);
    socket.on(event, async (data) => {
      try {
        const result = await _handler(socket, data);
        socket.emit(event, result);
      } catch (err) {
        console.error(err);
      }
    });
  }
}
