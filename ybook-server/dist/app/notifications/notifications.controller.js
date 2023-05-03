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
exports.notificationsController = void 0;
const db_1 = require("../../db");
const session_middleware_1 = require("../_middlewares/session.middleware");
exports.notificationsController = {
    api_getNotifications: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const session = yield (0, session_middleware_1.extractSession)(res);
        const unreadMessages = yield db_1.default.conversationMessage.findMany({
            where: {
                from: {
                    id: {
                        not: session.user.id,
                    },
                },
                conversation: {
                    OR: [{ fromId: session.user.id }, { toId: session.user.id }],
                },
                notification: { none: { read: true } },
            },
            select: { id: true, notification: { select: { id: true } } },
        });
        const unreadMessagesIds = unreadMessages.map((message) => message.id);
        console.log({ unreadMessages: unreadMessages.map((r) => r.notification) });
        const unreadMessagesNotifications = yield db_1.default.notification.findMany({
            where: {
                conversationMessageId: { in: unreadMessagesIds },
            },
        });
        console.log({ unreadMessagesNotifications });
        const notifications = yield db_1.default.notification.findMany({
            where: {
                OR: [
                    {
                        friendship: {
                            to: { email: session.email },
                            status: "PENDING",
                        },
                    },
                    { message: { id: { in: unreadMessagesIds } } },
                ],
            },
            include: {
                friendship: true,
                message: true,
            },
        });
        return res.json(notifications);
    }),
};
//# sourceMappingURL=notifications.controller.js.map