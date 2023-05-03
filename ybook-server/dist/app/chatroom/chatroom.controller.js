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
exports.chatroomController = void 0;
const zod_1 = require("zod");
const db_1 = require("../../db");
const error_middleware_1 = require("../_middlewares/error.middleware");
const session_middleware_1 = require("../_middlewares/session.middleware");
const friends_service_1 = require("../friends/friends.service");
const validateSchema_1 = require("../_utils/validateSchema");
const connectionPool_1 = require("../_utils/connectionPool");
exports.chatroomController = {
    api_startConversation: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const userId = (0, validateSchema_1.validateSchema)(zod_1.z.coerce.number(), req.body.userId);
        const session = yield (0, session_middleware_1.extractSession)(res);
        const friends = yield friends_service_1.friendsService.getFriends(session.email);
        if (!friends.map((friend) => friend.id).includes(userId)) {
            throw new error_middleware_1.ApiError(400, "User is not a friend");
        }
        const exists = yield db_1.default.conversation.findFirst({
            where: {
                OR: [
                    { fromId: session.user.id, toId: userId },
                    { fromId: userId, toId: session.user.id },
                ],
            },
        });
        if (exists) {
            return res.json(exists);
        }
        const chatroom = yield db_1.default.conversation.create({
            data: {
                from: { connect: { id: session.user.id } },
                to: { connect: { id: userId } },
            },
        });
        return res.json(chatroom);
    }),
    api_getConversations: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const session = yield (0, session_middleware_1.extractSession)(res);
        const conversations = yield db_1.default.conversation.findMany({
            where: {
                OR: [{ fromId: session.user.id }, { toId: session.user.id }],
            },
            include: {
                from: true,
                to: true,
                messages: { take: 1, orderBy: { createdAt: "desc" } },
            },
            distinct: "id",
        });
        return res.json(conversations);
    }),
    api_getConversation: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const id = (0, validateSchema_1.validateSchema)(zod_1.z.coerce.number(), req.params.id);
        const session = yield (0, session_middleware_1.extractSession)(res);
        const conversation = yield db_1.default.conversation.findFirst({
            where: {
                id,
                OR: [{ fromId: session.user.id }, { toId: session.user.id }],
            },
            include: {
                from: true,
                to: true,
                messages: { orderBy: { createdAt: "asc" } },
            },
        });
        if (!conversation) {
            throw new error_middleware_1.ApiError(404, "Conversation not found");
        }
        return res.json(conversation);
    }),
    api_getMessages: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const conversationId = (0, validateSchema_1.validateSchema)(zod_1.z.coerce.number(), req.params.id);
        const session = yield (0, session_middleware_1.extractSession)(res);
        const conversation = yield db_1.default.conversation.findFirst({
            where: {
                id: conversationId,
                OR: [{ fromId: session.user.id }, { toId: session.user.id }],
            },
        });
        if (!conversation) {
            throw new error_middleware_1.ApiError(404, "Conversation not found");
        }
        const conversationMessagesIds = (yield db_1.default.conversationMessage.findMany({
            where: {
                conversationId,
            },
        })).map((message) => message.id);
        yield db_1.default.notification.updateMany({
            where: {
                conversationMessageId: {
                    in: conversationMessagesIds,
                },
            },
            data: {
                read: true,
            },
        });
        const messages = yield db_1.default.conversationMessage.findMany({
            where: { conversationId },
            orderBy: { createdAt: "asc" },
            include: { from: true },
        });
        return res.json(messages);
    }),
    gw_authenticate: (socket, data) => __awaiter(void 0, void 0, void 0, function* () {
        const { token } = (0, validateSchema_1.validateSchema)(zod_1.z.object({ token: zod_1.z.string() }), data);
        const session = yield (0, session_middleware_1.getSessionFromToken)(token);
        connectionPool_1.connectionPool.set(socket.id, session.email);
        return { email: session.email };
    }),
    gw_deauthenticate: (socket) => __awaiter(void 0, void 0, void 0, function* () {
        connectionPool_1.connectionPool.delete(socket.id);
    }),
    gw_sendMessage: (socket, data) => __awaiter(void 0, void 0, void 0, function* () {
        const { conversationId, content } = (0, validateSchema_1.validateSchema)(zod_1.z.object({
            conversationId: zod_1.z.coerce.number(),
            content: zod_1.z.string(),
        }), data);
        const userEmail = (0, connectionPool_1.getConnection)(socket.id);
        const conversation = yield db_1.default.conversation.findFirst({
            where: {
                id: conversationId,
                OR: [{ from: { email: userEmail } }, { to: { email: userEmail } }],
            },
            include: {
                from: true,
                to: true,
            },
        });
        if (!conversation) {
            throw new error_middleware_1.ApiError(404, "Conversation not found");
        }
        const talkingTo = conversation.from.email === userEmail
            ? conversation.to
            : conversation.from;
        if (talkingTo === null) {
            throw new error_middleware_1.ApiError(500, "Conversation is missing a user");
        }
        const message = yield db_1.default.conversationMessage.create({
            data: {
                content,
                conversation: { connect: { id: conversationId } },
                from: { connect: { email: userEmail } },
            },
            include: {
                from: true,
            },
        });
        const otherUserSocketId = [...connectionPool_1.connectionPool.values()].find((otherUserEmail) => otherUserEmail === talkingTo.email);
        if (otherUserSocketId) {
            socket.to(otherUserSocketId).emit("new-message", message);
        }
        const notif = yield db_1.default.notification.create({
            data: {
                conversationMessageId: message.id,
                read: false,
            },
        });
        console.log(notif);
        return message;
    }),
};
//# sourceMappingURL=chatroom.controller.js.map