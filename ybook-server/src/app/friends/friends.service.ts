import prisma from "../../db";

export const friendsService = {
  async getFriends(email: string) {
    const friendships = await prisma.friendship.findMany({
      where: {
        AND: [
          { status: "ACCEPTED" },
          { OR: [{ from: { email } }, { to: { email } }] },
        ],
      },
      distinct: "id",
    });
    const friendshipsIds = friendships.map((friendship) => friendship.id);
    const friends = await prisma.user.findMany({
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
  },
  async getRequests(email: string) {
    const friendships = await prisma.friendship.findMany({
      where: { AND: [{ status: "PENDING" }, { to: { email } }] },
    });
    const friendshipsIds = friendships.map((friendship) => friendship.id);
    const potentialFriends = await prisma.user.findMany({
      where: { fromFriendship: { some: { id: { in: friendshipsIds } } } },
    });
    return potentialFriends;
  },
};
