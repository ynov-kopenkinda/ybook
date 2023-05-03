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
exports.friendsController = void 0;
const zod_1 = require("zod");
const db_1 = require("../../db");
const error_middleware_1 = require("../_middlewares/error.middleware");
const session_middleware_1 = require("../_middlewares/session.middleware");
const friends_service_1 = require("./friends.service");
const validateSchema_1 = require("../_utils/validateSchema");
exports.friendsController = {
    api_getFriends: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const session = yield (0, session_middleware_1.extractSession)(res);
        const friends = yield friends_service_1.friendsService.getFriends(session.email);
        return res.json(friends);
    }),
    api_getSuggested: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const session = yield (0, session_middleware_1.extractSession)(res);
        const friends = yield friends_service_1.friendsService.getFriends(session.email);
        const excludeFriends = friends.map((friend) => friend.id);
        const excludeBlocked = yield db_1.default.user.findUnique({
            where: { id: session.user.id },
            include: { blockedUsers: true },
        });
        if (excludeBlocked === null) {
            throw new error_middleware_1.ApiError(500, "Something went wrong");
        }
        const excludeBlockedIds = excludeBlocked.blockedUsers.map((blockedUser) => blockedUser.id);
        const suggested = yield db_1.default.user.findMany({
            where: {
                id: {
                    notIn: excludeFriends
                        .concat(session.user.id)
                        .concat(excludeBlockedIds),
                },
            },
            orderBy: { createdAt: "desc" },
            take: 5,
        });
        return res.json(suggested);
    }),
    api_getOthers: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const search = (0, validateSchema_1.validateSchema)(zod_1.z.string(), req.query.search);
        const session = yield (0, session_middleware_1.extractSession)(res);
        const friends = yield friends_service_1.friendsService.getFriends(session.email);
        const exclude = friends.map((friend) => friend.id);
        const suggested = yield db_1.default.user.findMany({
            where: {
                AND: [
                    { id: { notIn: exclude.concat(session.user.id) } },
                    {
                        OR: [
                            { email: { contains: search } },
                            { firstname: { contains: search } },
                            { lastname: { contains: search } },
                        ],
                    },
                ],
            },
            orderBy: { createdAt: "desc" },
        });
        return res.json(suggested);
    }),
    api_sendOrAcceptFriendRequest: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const userId = (0, validateSchema_1.validateSchema)(zod_1.z.coerce.number(), req.body.userId);
        const session = yield (0, session_middleware_1.extractSession)(res);
        if (userId === session.user.id) {
            throw new error_middleware_1.ApiError(400, "You can't add yourself as a friend");
        }
        const requestExists = yield db_1.default.friendship.findFirst({
            where: {
                from: { id: userId },
                to: { id: session.user.id },
            },
        });
        if (requestExists !== null) {
            yield db_1.default.friendship.update({
                where: { id: requestExists.id },
                data: { status: "ACCEPTED" },
            });
            return res.json({ success: true });
        }
        const friendship = yield db_1.default.friendship.create({
            data: {
                from: { connect: { id: session.user.id } },
                to: { connect: { id: userId } },
                status: "PENDING",
            },
        });
        yield db_1.default.notification.create({
            data: {
                friendship: { connect: { id: friendship.id } },
                read: false,
            },
        });
        return res.json({ success: true });
    }),
    api_removeOrRejectFriendRequest: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const friendId = (0, validateSchema_1.validateSchema)(zod_1.z.coerce.number(), req.body.id);
        const session = yield (0, session_middleware_1.extractSession)(res);
        const friendship = yield db_1.default.friendship.findFirst({
            where: {
                OR: [
                    { from: { email: session.email }, to: { id: friendId } },
                    { from: { id: friendId }, to: { email: session.email } },
                ],
            },
        });
        if (friendship === null) {
            throw new error_middleware_1.ApiError(404, "Friendship not found");
        }
        yield db_1.default.friendship.delete({ where: { id: friendship.id } });
        return res.json({ success: true });
    }),
    api_getFriendRequests: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const session = yield (0, session_middleware_1.extractSession)(res);
        const requests = yield friends_service_1.friendsService.getRequests(session.email);
        return res.json(requests);
    })
};
//# sourceMappingURL=friends.controller.js.map