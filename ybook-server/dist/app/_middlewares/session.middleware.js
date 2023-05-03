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
exports.extractSession = exports.extractSessionOrNull = exports.isAuthed = exports.getSessionFromToken = void 0;
const aws_jwt_verify_1 = require("aws-jwt-verify");
const db_1 = require("../../db");
const env_1 = require("../../env");
const error_middleware_1 = require("./error.middleware");
const verifier = aws_jwt_verify_1.CognitoJwtVerifier.create({
    userPoolId: env_1.env.COGNITO_USERPOOL_ID,
    tokenUse: "id",
    clientId: env_1.env.COGNITO_CLIENT_ID,
});
const getSessionFromToken = (token) => __awaiter(void 0, void 0, void 0, function* () {
    const session = yield verifier.verify(token);
    const sessionData = {
        name: session.name,
        surname: session.given_name,
        email: session.email,
    };
    return sessionData;
});
exports.getSessionFromToken = getSessionFromToken;
const isAuthed = (error) => (0, error_middleware_1.useApi)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const token = (_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.split(" ")[1];
    if (token === undefined) {
        if (error) {
            return res.status(401).send("Unauthorized");
        }
        return next();
    }
    try {
        const sessionData = yield (0, exports.getSessionFromToken)(token);
        res.locals.session = sessionData;
        return next();
    }
    catch (e) {
        if (error) {
            return res.status(401).send("Unauthorized");
        }
        return next();
    }
}));
exports.isAuthed = isAuthed;
const extractSessionOrNull = (res) => __awaiter(void 0, void 0, void 0, function* () {
    const session = res.locals.session;
    if (session === undefined) {
        return null;
    }
    const user = yield db_1.default.user.findUnique({
        where: {
            email: session.email,
        },
        include: {
            blockedUsers: {
                select: {
                    id: true,
                },
            },
            blockedByUsers: {
                select: {
                    id: true,
                },
            },
        },
    });
    if (user === null) {
        return null;
    }
    const _session = Object.assign({ user }, session);
    return _session;
});
exports.extractSessionOrNull = extractSessionOrNull;
const extractSession = (res) => __awaiter(void 0, void 0, void 0, function* () {
    const session = yield (0, exports.extractSessionOrNull)(res);
    if (session === null) {
        throw new error_middleware_1.ApiError(401, "Unauthorized");
    }
    return session;
});
exports.extractSession = extractSession;
//# sourceMappingURL=session.middleware.js.map