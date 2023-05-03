import { z } from "zod";
import prisma from "../../db";
import { ApiError } from "../_middlewares/error.middleware";
import {
  extractSession,
  getSessionFromToken,
} from "../_middlewares/session.middleware";
import { friendsService } from "../friends/friends.service";
import type { ApiController } from "../../types";
import { validateSchema } from "../_utils/validateSchema";
import { connectionPool, getConnection } from "../_utils/connectionPool";

export const chatroomController = {
  api_startConversation: async (req, res) => {
    const userId = validateSchema(z.coerce.number(), req.body.userId);
    const session = await extractSession(res);
    const friends = await friendsService.getFriends(session.email);
    if (!friends.map((friend) => friend.id).includes(userId)) {
      throw new ApiError(400, "User is not a friend");
    }
    const exists = await prisma.conversation.findFirst({
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
    const chatroom = await prisma.conversation.create({
      data: {
        from: { connect: { id: session.user.id } },
        to: { connect: { id: userId } },
      },
    });
    return res.json(chatroom);
  },
  api_getConversations: async (req, res) => {
    const session = await extractSession(res);
    const conversations = await prisma.conversation.findMany({
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
  },
  api_getConversation: async (req, res) => {
    const id = validateSchema(z.coerce.number(), req.params.id);
    const session = await extractSession(res);
    const conversation = await prisma.conversation.findFirst({
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
      throw new ApiError(404, "Conversation not found");
    }
    return res.json(conversation);
  },
  api_getMessages: async (req, res) => {
    const conversationId = validateSchema(z.coerce.number(), req.params.id);
    const session = await extractSession(res);
    const conversation = await prisma.conversation.findFirst({
      where: {
        id: conversationId,
        OR: [{ fromId: session.user.id }, { toId: session.user.id }],
      },
    });
    if (!conversation) {
      throw new ApiError(404, "Conversation not found");
    }
    const conversationMessagesIds = (
      await prisma.conversationMessage.findMany({
        where: {
          conversationId,
        },
      })
    ).map((message) => message.id);
    await prisma.notification.updateMany({
      where: {
        conversationMessageId: {
          in: conversationMessagesIds,
        },
      },
      data: {
        read: true,
      },
    });
    const messages = await prisma.conversationMessage.findMany({
      where: { conversationId },
      orderBy: { createdAt: "asc" },
      include: { from: true },
    });
    return res.json(messages);
  },
  gw_authenticate: async (socket, data) => {
    const { token } = validateSchema(z.object({ token: z.string() }), data);
    const session = await getSessionFromToken(token);
    connectionPool.set(socket.id, session.email);
    return { email: session.email };
  },
  gw_deauthenticate: async (socket) => {
    connectionPool.delete(socket.id);
  },
  gw_sendMessage: async (socket, data) => {
    const { conversationId, content } = validateSchema(
      z.object({
        conversationId: z.coerce.number(),
        content: z.string(),
      }),
      data
    );
    const userEmail = getConnection(socket.id);
    const conversation = await prisma.conversation.findFirst({
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
      throw new ApiError(404, "Conversation not found");
    }
    const talkingTo =
      conversation.from.email === userEmail
        ? conversation.to
        : conversation.from;
    if (talkingTo === null) {
      throw new ApiError(500, "Conversation is missing a user");
    }
    const message = await prisma.conversationMessage.create({
      data: {
        content,
        conversation: { connect: { id: conversationId } },
        from: { connect: { email: userEmail } },
      },
      include: {
        from: true,
      },
    });
    const otherUserSocketId = [...connectionPool.values()].find(
      (otherUserEmail) => otherUserEmail === talkingTo.email
    );
    if (otherUserSocketId) {
      socket.to(otherUserSocketId).emit("new-message", message);
    }
    const notif = await prisma.notification.create({
      data: {
        conversationMessageId: message.id,
        read: false,
      },
    });
    console.log(notif);
    return message;
  },
} satisfies ApiController;
