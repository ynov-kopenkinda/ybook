import { z } from "zod";
import prisma from "../../db";
import { ApiError } from "../_middlewares/error.middleware";
import { extractSession } from "../_middlewares/session.middleware";
import { friendsService } from "./friends.service";
import type { ApiController } from "../../types";
import { validateSchema } from "../_utils/validateSchema";

export const friendsController = {
  api_getFriends: async (req, res) => {
    const session = await extractSession(res);
    const friends = await friendsService.getFriends(session.email);
    return res.json(friends);
  },
  api_getSuggested: async (req, res) => {
    const session = await extractSession(res);
    const friends = await friendsService.getFriends(session.email);
    const excludeFriends = friends.map((friend) => friend.id);
    const excludeBlocked = await prisma.user.findUnique({
      where: { id: session.user.id },
      include: { blockedUsers: true },
    });
    if (excludeBlocked === null) {
      throw new ApiError(500, "Something went wrong");
    }
    const excludeBlockedIds = excludeBlocked.blockedUsers.map(
      (blockedUser) => blockedUser.id
    );
    const suggested = await prisma.user.findMany({
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
  },
  api_getOthers: async (req, res) => {
    const search = validateSchema(z.string(), req.query.search);
    const session = await extractSession(res);
    const friends = await friendsService.getFriends(session.email);
    const exclude = friends.map((friend) => friend.id);
    const suggested = await prisma.user.findMany({
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
  },
  api_sendOrAcceptFriendRequest: async (req, res) => {
    const userId = validateSchema(z.coerce.number(), req.body.userId);
    const session = await extractSession(res);
    if (userId === session.user.id) {
      throw new ApiError(400, "You can't add yourself as a friend");
    }
    const requestExists = await prisma.friendship.findFirst({
      where: {
        from: { id: userId },
        to: { id: session.user.id },
      },
    });
    if (requestExists !== null) {
      await prisma.friendship.update({
        where: { id: requestExists.id },
        data: { status: "ACCEPTED" },
      });
      return res.json({ success: true });
    }
    const friendship = await prisma.friendship.create({
      data: {
        from: { connect: { id: session.user.id } },
        to: { connect: { id: userId } },
        status: "PENDING",
      },
    });
    await prisma.notification.create({
      data: {
        friendship: { connect: { id: friendship.id } },
        read: false,
      },
    });
    return res.json({ success: true });
  },
  api_removeOrRejectFriendRequest: async (req, res) => {
    const friendId = validateSchema(z.coerce.number(), req.body.id);
    const session = await extractSession(res);
    const friendship = await prisma.friendship.findFirst({
      where: {
        OR: [
          { from: { email: session.email }, to: { id: friendId } },
          { from: { id: friendId }, to: { email: session.email } },
        ],
      },
    });
    if (friendship === null) {
      throw new ApiError(404, "Friendship not found");
    }
    await prisma.friendship.delete({ where: { id: friendship.id } });
    return res.json({ success: true });
  },
  api_getFriendRequests: async (req, res) => {
    const session = await extractSession(res);
    const requests = await friendsService.getRequests(session.email);
    return res.json(requests);
  }
} satisfies ApiController;
