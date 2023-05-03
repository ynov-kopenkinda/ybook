import { z } from "zod";
import prisma from "../../db";
import { ApiError } from "../_middlewares/error.middleware";
import { extractSession } from "../_middlewares/session.middleware";
import { friendsService } from "../friends/friends.service";
import type { ApiController } from "../../types";
import { validateSchema } from "../_utils/validateSchema";

export const userController = {
  api_changeAvatar: async (req, res) => {
    const s3Key = validateSchema(z.string(), req.body.s3key);
    const session = await extractSession(res);
    const user = await prisma.user.update({
      where: { id: session.user.id },
      data: { avatarS3Key: s3Key },
    });
    return res.json({ user });
  },
  api_changeCover: async (req, res) => {
    const s3Key = validateSchema(z.string(), req.body.s3key);
    const session = await extractSession(res);
    const user = await prisma.user.update({
      where: { id: session.user.id },
      data: { coverPicS3Key: s3Key },
    });
    return res.json({ user });
  },
  api_getDetails: async (req, res) => {
    const userId = validateSchema(z.coerce.number(), req.params.id);
    const session = await extractSession(res);
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        blockedByUsers: true,
      },
    });
    if (!user) {
      throw new ApiError(404, "User not found");
    }
    const friends = await friendsService.getFriends(user.email);
    const pendingFriendship = await prisma.friendship.findFirst({
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
  },
  api_blockUser: async (req, res) => {
    const userId = validateSchema(z.coerce.number(), req.params.id);
    const session = await extractSession(res);
    const other = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        blockedByUsers: true,
      },
    });
    if (other === null) {
      throw new ApiError(404, "User not found");
    }
    if (other.blockedByUsers.some((u) => u.id === session.user.id)) {
      throw new ApiError(400, "User already blocked");
    }
    await prisma.user.update({
      where: { id: session.user.id },
      data: {
        blockedUsers: {
          connect: { id: userId },
        },
      },
    });
    return res.json({ success: true });
  },
  api_unblockUser: async (req, res) => {
    const userId = validateSchema(z.coerce.number(), req.params.id);
    const session = await extractSession(res);
    const other = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        blockedByUsers: true,
      },
    });
    if (other === null) {
      throw new ApiError(404, "User not found");
    }
    if (!other.blockedByUsers.some((u) => u.id === session.user.id)) {
      throw new ApiError(400, "User not blocked");
    }
    await prisma.user.update({
      where: { id: session.user.id },
      data: {
        blockedUsers: {
          disconnect: { id: userId },
        },
      },
    });
    return res.json({ success: true });
  },
  api_getBlockedUsers: async (req, res) => {
    const session = await extractSession(res);
    const blockedUsers = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { blockedUsers: true },
    });
    return res.json({ blockedUsers: blockedUsers?.blockedUsers ?? [] });
  },
} satisfies ApiController;
