"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerGateway = void 0;
const error_middleware_1 = require("../_middlewares/error.middleware");
function registerGateway(socket, gateway) {
    for (const [event, handler] of Object.values(gateway)) {
        const _handler = (0, error_middleware_1.useGateway)(handler);
        socket.on(event, (data) => __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield _handler(socket, data);
                socket.emit(event, result);
            }
            catch (err) {
                console.error(err);
            }
        }));
    }
}
exports.registerGateway = registerGateway;
//# sourceMappingURL=registerGateway.js.map