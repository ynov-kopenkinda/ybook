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
exports.authController = void 0;
const db_1 = require("../../db");
const session_middleware_1 = require("../_middlewares/session.middleware");
exports.authController = {
    api_getSession: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const session = yield (0, session_middleware_1.extractSessionOrNull)(res);
        return res.json({ session });
    }),
    api_createUser: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const session = yield (0, session_middleware_1.extractSession)(res);
        const user = yield db_1.default.user.upsert({
            where: {
                email: session.email,
            },
            create: {
                email: session.email,
                firstname: session.name,
                lastname: session.surname,
            },
            update: {
                email: session.email,
                firstname: session.name,
                lastname: session.surname,
            },
        });
        return res.json({ user });
    }),
};
//# sourceMappingURL=auth.controller.js.map