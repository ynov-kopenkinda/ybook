import { env } from "../env";
import { authStore } from "../store/auth.store";
import * as types from "./api.types";

const getToken = () => authStore.getState().token;

const logging = env.NODE_ENV === "development";

async function _fetch<T = unknown>(
  url: string,
  options: RequestInit = {}
): Promise<[T, null] | [null, types.ApiError]> {
  if (!url.startsWith("/")) {
    throw new Error("Api URL must start with a /");
  }
  const token = getToken();
  const headers = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
  try {
    if (logging) {
      console.log(
        `%c>>> API [${options.method || "GET"}]`,
        "background: #f5df89; color: black; font-weight: bold; padding: 4px;",
        url,
        options.body === undefined
          ? "empty"
          : JSON.parse(options.body as string)
      );
    }
    const response = await fetch(`${env.REACT_APP_BACKEND_URL}${url}`, {
      ...options,
      headers: { ...headers, ...options.headers },
    });
    if (!response.ok) {
      throw new Error(response.statusText);
    }
    const data = (await response.json()) as T;
    if (logging) {
      console.log(
        `%c<<< API [${options.method || "GET"}]`,
        "background: #3d82f6; color: white; font-weight: bold; padding: 4px;",
        url,
        data
      );
    }
    return [data, null];
  } catch (error) {
    if (logging) {
      console.error(
        `%c<<< API [${options.method || "GET"}]`,
        "background: #ef4444; color: white; font-weight: bold; padding: 4px;",
        url,
        error
      );
    }
    return [null, error as types.ApiError];
  }
}

export const api = {
  s3: {
    getUploadUrl() {
      return _fetch<types.ApiS3UploadResponse>("/s3/upload");
    },
    getResourceUrl({ s3key }: { s3key: string }) {
      return _fetch<types.ApiS3GetResourceResponse>(
        `/s3/image?s3key=${encodeURIComponent(s3key)}`
      );
    },
  },
  auth: {
    createUser() {
      return _fetch<types.ApiCreateUserResponse>("/auth/createUser", {
        method: "POST",
      });
    },
    getSession() {
      return _fetch<types.ApiGetSessionResponse>("/auth/session");
    },
  },
  friends: {
    getAll() {
      return _fetch<types.ApiGetFriendsResponse>("/friends");
    },
    getSuggested() {
      return _fetch<types.ApiGetSuggestedFriendsResponse>("/friends/suggested");
    },
    getRequests() {
      return _fetch<types.ApiGetFriendRequestsResponse>("/friends/requests");
    },
    cancel({ friendId }: { friendId: number }) {
      return _fetch<types.ApiCancelFriendRequestResponse>("/friends/", {
        method: "DELETE",
        body: JSON.stringify({ id: friendId }),
      });
    },
    request({ userId }: { userId: number }) {
      return _fetch<types.ApiRequestFriendResponse>("/friends", {
        method: "POST",
        body: JSON.stringify({ userId }),
      });
    },
  },
  posts: {
    getAll({ page = 1, friendsOnly = false }) {
      return _fetch<types.ApiGetPostsResponse>(
        `/posts?page=${page}${friendsOnly ? "&friendsOnly=true" : ""}`
      );
    },
    getOne({ id }: { id: number }) {
      return _fetch<types.ApiGetPostResponse>(`/posts/${id}`);
    },
    create({ content }: { content: string }) {
      return _fetch<types.ApiCreatePostResponse>("/posts", {
        method: "POST",
        body: JSON.stringify({ content }),
      });
    },
    like({ postId }: { postId: number }) {
      return _fetch(`/posts/${postId}/like`, {
        method: "POST",
      });
    },
    reply({ postId, content }: { postId: number; content: string }) {
      return _fetch(`/posts/${postId}/reply`, {
        method: "POST",
        body: JSON.stringify({ content }),
      });
    },
  },
  users: {
    getAll(search = "") {
      return _fetch<types.ApiGetUsersResponse>(
        `/friends/global?search=${search}`
      );
    },
    getOne({ id }: { id: number }) {
      return _fetch<types.ApiGetUserResponse>(`/users/${id}`);
    },
    block({ userId }: { userId: number }) {
      return _fetch(`/users/${userId}/block`, {
        method: "POST",
      });
    },
    unblock({ userId }: { userId: number }) {
      return _fetch(`/users/${userId}/unblock`, {
        method: "POST",
      });
    },
    getBlocked() {
      return _fetch<types.ApiGetBlockedUsersResponse>("/users/blocked");
    },
  },
  settings: {
    changeImage({ s3key, type }: { s3key: string; type: "avatar" | "cover" }) {
      return _fetch<types.ApiChangeAvatarResponse>(`/users/change-${type}`, {
        method: "POST",
        body: JSON.stringify({ s3key }),
      });
    },
  },
  notifications: {
    get() {
      return _fetch<types.ApiGetNotificationsResponse>("/notifications");
    },
  },
  chatrooms: {
    startConversation({ withUserId }: { withUserId: number }) {
      return _fetch<types.ApiStartConversationResponse>("/chatrooms/", {
        method: "POST",
        body: JSON.stringify({ userId: withUserId }),
      });
    },
    getConversations() {
      return _fetch<types.ApiGetConversationsResponse>("/chatrooms");
    },
    getConversation({ id }: { id: number }) {
      return _fetch<types.ApiGetConversationResponse>(`/chatrooms/${id}`);
    },
    getMessages({ id }: { id: number }) {
      return _fetch<types.ApiGetMessagesResponse>(`/chatrooms/${id}/messages`);
    },
  },
};
