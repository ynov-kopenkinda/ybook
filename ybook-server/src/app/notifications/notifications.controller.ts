import prisma from "../../db";
import { extractSession } from "../_middlewares/session.middleware";
import type { ApiController } from "../../types";

export const notificationsController = {
  api_getNotifications: async (req, res) => {
    const session = await extractSession(res);
    const unreadMessages = await prisma.conversationMessage.findMany({
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

    const unreadMessagesNotifications = await prisma.notification.findMany({
      where: {
        conversationMessageId: { in: unreadMessagesIds },
      },
    });
    console.log({ unreadMessagesNotifications });

    const notifications = await prisma.notification.findMany({
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
  },
} satisfies ApiController;
