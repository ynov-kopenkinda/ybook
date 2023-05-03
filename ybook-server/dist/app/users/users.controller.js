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
exports.userController = void 0;
const zod_1 = require("zod");
const db_1 = require("../../db");
const error_middleware_1 = require("../_middlewares/error.middleware");
const session_middleware_1 = require("../_middlewares/session.middleware");
const friends_service_1 = require("../friends/friends.service");
const validateSchema_1 = require("../_utils/validateSchema");
exports.userController = {
    api_changeAvatar: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const s3Key = (0, validateSchema_1.validateSchema)(zod_1.z.string(), req.body.s3key);
        const session = yield (0, session_middleware_1.extractSession)(res);
        const user = yield db_1.default.user.update({
            where: { id: session.user.id },
            data: { avatarS3Key: s3Key },
        });
        return res.json({ user });
    }),
    api_changeCover: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const s3Key = (0, validateSchema_1.validateSchema)(zod_1.z.string(), req.body.s3key);
        const session = yield (0, session_middleware_1.extractSession)(res);
        const user = yield db_1.default.user.update({
            where: { id: session.user.id },
            data: { coverPicS3Key: s3Key },
        });
        return res.json({ user });
    }),
    api_getDetails: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const userId = (0, validateSchema_1.validateSchema)(zod_1.z.coerce.number(), req.params.id);
        const session = yield (0, session_middleware_1.extractSession)(res);
        const user = yield db_1.default.user.findUnique({
            where: { id: userId },
            include: {
                blockedByUsers: true,
            },
        });
        if (!user) {
            throw new error_middleware_1.ApiError(404, "User not found");
        }
        const friends = yield friends_service_1.friendsService.getFriends(user.email);
        const pendingFriendship = yield db_1.default.friendship.findFirst({
            where: {
                AND: [
                    {
                        OR: [
                            { fromId: session.user.id, toId: user.id },
                            { toId: session.user.id, fromId: user.id },
                        ],
                    },
                    { status: "PENDING" },
                ],
            },
        });
        return res.json({ user, friends, pending: pendingFriendship });
    }),
    api_blockUser: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const userId = (0, validateSchema_1.validateSchema)(zod_1.z.coerce.number(), req.params.id);
        const session = yield (0, session_middleware_1.extractSession)(res);
        const other = yield db_1.default.user.findUnique({
            where: { id: userId },
            include: {
                blockedByUsers: true,
            },
        });
        if (other === null) {
            throw new error_middleware_1.ApiError(404, "User not found");
        }
        if (other.blockedByUsers.some((u) => u.id === session.user.id)) {
            throw new error_middleware_1.ApiError(400, "User already blocked");
        }
        yield db_1.default.user.update({
            where: { id: session.user.id },
            data: {
                blockedUsers: {
                    connect: { id: userId },
                },
            },
        });
        return res.json({ success: true });
    }),
    api_unblockUser: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const userId = (0, validateSchema_1.validateSchema)(zod_1.z.coerce.number(), req.params.id);
        const session = yield (0, session_middleware_1.extractSession)(res);
        const other = yield db_1.default.user.findUnique({
            where: { id: userId },
            include: {
                blockedByUsers: true,
            },
        });
        if (other === null) {
            throw new error_middleware_1.ApiError(404, "User not found");
        }
        if (!other.blockedByUsers.some((u) => u.id === session.user.id)) {
            throw new error_middleware_1.ApiError(400, "User not blocked");
        }
        yield db_1.default.user.update({
            where: { id: session.user.id },
            data: {
                blockedUsers: {
                    disconnect: { id: userId },
                },
            },
        });
        return res.json({ success: true });
    }),
    api_getBlockedUsers: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        var _a;
        const session = yield (0, session_middleware_1.extractSession)(res);
        const blockedUsers = yield db_1.default.user.findUnique({
            where: { id: session.user.id },
            select: { blockedUsers: true },
        });
        return res.json({ blockedUsers: (_a = blockedUsers === null || blockedUsers === void 0 ? void 0 : blockedUsers.blockedUsers) !== null && _a !== void 0 ? _a : [] });
    }),
};
//# sourceMappingURL=users.controller.js.map