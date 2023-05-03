import type { RequestHandler, ErrorRequestHandler } from "express";
import type { Socket } from "socket.io";
import type { GatewayHandler } from "../../types";

const HttpErrorMap = {
  200: "OK",
  201: "Created",
  202: "Accepted",
  203: "Non-Authoritative Information",
  204: "No Content",
  205: "Reset Content",
  206: "Partial Content",
  207: "Multi-Status (WebDAV)",
  208: "Already Reported (WebDAV)",
  226: "IM Used",
  300: "Multiple Choices",
  301: "Moved Permanently",
  302: "Found",
  303: "See Other",
  304: "Not Modified",
  305: "Use Proxy",
  306: "(Unused)",
  307: "Temporary Redirect",
  308: "Permanent Redirect (experimental)",
  400: "Bad Request",
  401: "Unauthorized",
  402: "Payment Required",
  403: "Forbidden",
  404: "Not Found",
  405: "Method Not Allowed",
  406: "Not Acceptable",
  407: "Proxy Authentication Required",
  408: "Request Timeout",
  409: "Conflict",
  410: "Gone",
  411: "Length Required",
  412: "Precondition Failed",
  413: "Request Entity Too Large",
  414: "Request-URI Too Long",
  415: "Unsupported Media Type",
  416: "Requested Range Not Satisfiable",
  417: "Expectation Failed",
  418: "I'm a teapot (RFC 2324)",
  420: "Enhance Your Calm (Twitter)",
  422: "Unprocessable Entity (WebDAV)",
  423: "Locked (WebDAV)",
  424: "Failed Dependency (WebDAV)",
  425: "Reserved for WebDAV",
  426: "Upgrade Required",
  428: "Precondition Required",
  429: "Too Many Requests",
  431: "Request Header Fields Too Large",
  444: "No Response (Nginx)",
  449: "Retry With (Microsoft)",
  450: "Blocked by Windows Parental Controls (Microsoft)",
  451: "Unavailable For Legal Reasons",
  499: "Client Closed Request (Nginx)",
  500: "Internal Server Error",
  501: "Not Implemented",
  502: "Bad Gateway",
  503: "Service Unavailable",
  504: "Gateway Timeout",
  505: "HTTP Version Not Supported",
  506: "Variant Also Negotiates (Experimental)",
  507: "Insufficient Storage (WebDAV)",
  508: "Loop Detected (WebDAV)",
  509: "Bandwidth Limit Exceeded (Apache)",
  510: "Not Extended",
  511: "Network Authentication Required",
  598: "Network read timeout error",
  599: "Network connect timeout error",
} as const;

export type HttpErrorCode = keyof typeof HttpErrorMap;

export class ApiError extends Error {
  public readonly code: HttpErrorCode;
  public readonly message: string;
  public readonly reason: typeof HttpErrorMap[keyof typeof HttpErrorMap];
  constructor(code: HttpErrorCode, message: string) {
    super();
    this.code = code;
    this.message = message;
    this.reason = HttpErrorMap[code];
  }
}

export function useApi(fn: RequestHandler): RequestHandler {
  return (req, res, next) => {
    return Promise.resolve(fn(req, res, next)).catch(next);
  };
}
export function useGateway<T>(fn: GatewayHandler<T>) {
  return (socket: Socket, data: unknown) =>
    Promise.resolve(fn(socket, data)).catch((error) => {
      if (error instanceof ApiError) {
        socket.emit("error", error);
      } else {
        throw error;
      }
    });
}

export const notFoundMiddleware: RequestHandler = (req, res, next) => {
  next(new ApiError(404, "Ressource Not Found"));
};

export const catchAllMiddleware: ErrorRequestHandler = (
  err,
  req,
  res,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars -- next is required by express
  _next
) => {
  if (err instanceof ApiError) {
    return res.status(err.code).json(err);
  }
  const internalServerError = new ApiError(500, "Internal Server Error");
  return res.status(internalServerError.code).json(internalServerError);
};
