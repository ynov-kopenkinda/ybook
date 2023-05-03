import type { RequestHandler } from "express";
import type { Socket } from "socket.io";

export type ApiController = {
  [key: `api_${string}`]: RequestHandler;
  [key: `gw_${string}`]: GatewayHandler<unknown>;
};

export type ApiGateway = Record<
  string,
  [event: string, handler: GatewayHandler<unknown>]
>;

export type GatewayHandler<T> = (
  socket: Socket,
  data: unknown
) => T | Promise<T>;
