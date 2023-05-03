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
exports.friendsService = void 0;
const db_1 = require("../../db");
exports.friendsService = {
    getFriends(email) {
        return __awaiter(this, void 0, void 0, function* () {
            const friendships = yield db_1.default.friendship.findMany({
                where: {
                    AND: [
                        { status: "ACCEPTED" },
                        { OR: [{ from: { email } }, { to: { email } }] },
                    ],
                },
                distinct: "id",
            });
            const friendshipsIds = friendships.map((friendship) => friendship.id);
            const friends = yield db_1.default.user.findMany({
                where: {
                    AND: [
                        {
                            OR: [
                                { fromFriendship: { some: { id: { in: friendshipsIds } } } },
                                { toFrienship: { some: { id: { in: friendshipsIds } } } },
                            ],
                        },
                        { email: { not: email } },
                        { blockedByUsers: { every: { email: { not: email } } } },
                        { blockedUsers: { every: { email: { not: email } } } },
                    ],
                },
            });
            return friends;
        });
    },
    getRequests(email) {
        return __awaiter(this, void 0, void 0, function* () {
            const friendships = yield db_1.default.friendship.findMany({
                where: { AND: [{ status: "PENDING" }, { to: { email } }] },
            });
            const friendshipsIds = friendships.map((friendship) => friendship.id);
            const potentialFriends = yield db_1.default.user.findMany({
                where: { fromFriendship: { some: { id: { in: friendshipsIds } } } },
            });
            return potentialFriends;
        });
    },
};
//# sourceMappingURL=friends.service.js.map