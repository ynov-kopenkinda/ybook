import type { User } from "@prisma/client";
import { z } from "zod";
import prisma from "../../db";
import type { ApiController } from "../../types";
import { friendsService } from "../friends/friends.service";
import { ApiError } from "../_middlewares/error.middleware";
import { extractSession } from "../_middlewares/session.middleware";
import { validateSchema } from "../_utils/validateSchema";

export const postsController = {
  api_getPosts: async (req, res) => {
    const page = validateSchema(z.coerce.number().min(1), req.query.page);
    const friendsOnly =
      validateSchema(z.coerce.boolean().optional(), req.query.friendsOnly) ??
      false;
    const session = await extractSession(res);
    const limit = 10;
    let friends: User[] = [];
    if (friendsOnly) {
      friends = await friendsService.getFriends(session.email);
    }
    const offset = (page - 1) * limit;
    const count = await prisma.post.count(
      friendsOnly
        ? {
            where: {
              userId: { in: friends.map((f) => f.id) },
            },
          }
        : undefined
    );
    const posts = await prisma.post.findMany({
      where: friendsOnly ? { userId: { in: friends.map((f) => f.id) } } : {},
      skip: offset,
      take: limit,
      orderBy: {
        createdAt: "desc",
      },
      include: {
        user: true,
        postComments: {
          include: { user: true },
        },
        postLikes: { include: { user: true } },
        postAttachments: true,
      },
    });
    return res.json({
      posts,
      page,
      pages: Math.ceil(count / limit),
    });
  },
  api_getPost: async (req, res) => {
    const postId = validateSchema(z.coerce.number(), req.params.postId);
    const post = await prisma.post.findUnique({
      where: { id: postId },
      include: {
        user: true,
        postComments: {
          include: { user: true },
        },
        postLikes: { include: { user: true } },
        postAttachments: true,
      },
    });
    if (!post) {
      return res.status(404).send("Post not found");
    }
    return res.json(post);
  },
  api_createPost: async (req, res) => {
    const content = validateSchema(z.string(), req.body.content);
    const session = await extractSession(res);
    const post = await prisma.post.create({
      data: {
        htmlContent: content,
        user: { connect: { email: session.email } },
      },
    });
    return res.json(post);
  },
  api_likePost: async (req, res) => {
    const postId = validateSchema(z.coerce.number(), req.params.postId);
    const session = await extractSession(res);
    const post = await prisma.post.findUnique({
      where: { id: postId },
    });
    if (!post) {
      throw new ApiError(404, "Post not found");
    }
    const postLike = await prisma.postLike.findFirst({
      where: {
        user: {
          email: session.email,
        },
        postId,
      },
    });
    if (postLike) {
      await prisma.postLike.delete({
        where: { id: postLike.id },
      });
    } else {
      await prisma.postLike.create({
        data: {
          user: { connect: { email: session.email } },
          post: { connect: { id: postId } },
        },
      });
    }
    return res.json({ success: true });
  },
  api_replyToPost: async (req, res) => {
    const postId = validateSchema(z.coerce.number(), req.params.postId);
    const session = await extractSession(res);
    const { content } = req.body;
    if (typeof content !== "string") {
      throw new ApiError(400, "Content must be a string");
    }
    const post = await prisma.post.findUnique({
      where: { id: postId },
    });
    if (!post) {
      throw new ApiError(404, "Post not found");
    }
    const postComment = await prisma.postComment.create({
      data: {
        post: { connect: { id: postId } },
        text: content,
        user: { connect: { email: session.email } },
      },
    });
    return res.json(postComment);
  },
} satisfies ApiController;
