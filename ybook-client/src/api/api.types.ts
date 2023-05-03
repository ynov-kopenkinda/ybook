export type ApiS3UploadResponse = {
  url: string;
  key: string;
};

export type ApiS3GetResourceResponse = {
  url: string;
};

export type ApiCreateUserResponse = {
  user: User;
};

export type ApiGetFriendsResponse = User[];

export type ApiGetUsersResponse = User[];

export type ApiGetUserResponse = {
  user: User & { blockedByUsers: User[] };
  friends: User[];
  pending: Friendship | null;
};

export type ApiCancelFriendRequestResponse = {
  success: boolean;
};

export type ApiRequestFriendResponse = {
  success: boolean;
};

export type ApiGetSuggestedFriendsResponse = User[];

export type ApiGetFriendRequestsResponse = User[];

export type ApiCreatePostResponse = Post;

export type ApiGetPostsResponse = {
  posts: Post[];
  page: number;
  pages: number;
};

export type ApiGetPostResponse = Post;

export type ApiGetSessionResponse = {
  session: Session | null;
};

export type ApiGetNotificationsResponse = Notification[];

export type ApiChangeAvatarResponse = {
  user: User;
};

export type ApiStartConversationResponse = Chatroom;

export type ApiGetConversationsResponse = (Chatroom & {
  from: User;
  to: User;
  messages: Message[];
})[];

export type ApiGetConversationResponse = Chatroom & {
  from: User;
  to: User;
  messages: Message[];
};

export type ApiGetMessagesResponse = (Message & { from: User })[];

export type ApiGetBlockedUsersResponse = { blockedUsers: User[] };

// Types

export type Session = {
  name: string;
  surname: string;
  email: string;
  user: User & {
    blockedUsers: { id: User["id"] }[];
    blockedByUsers: { id: User["id"] }[];
  };
};

export type Post = {
  id: number;
  createdAt: string;
  updatedAt: string;
  htmlContent: string;
  userId: number;
  user: User;
  postComments: PostCommentElement[];
  postLikes: PostCommentElement[];
  postAttachments: any[];
};

export type PostCommentElement = {
  id: number;
  createdAt: string;
  updatedAt: string;
  userId: number;
  postId: number;
  text?: string;
  user: User;
};

export type User = {
  id: number;
  createdAt: string;
  updatedAt: string;
  firstname: string;
  lastname: string;
  email: string;
  avatarS3Key: string | null;
  coverPicS3Key: string | null;
  config: null;
};

export type Notification = {
  id: number;
  createdAt: string;
  updatedAt: string;
  read: boolean;
  friendshipId: number;
  conversationMessageId: null;
  friendship: Friendship;
  message: null;
};

export type Friendship = {
  id: number;
  createdAt: string;
  updatedAt: string;
  status: string;
  fromId: number;
  toId: number;
};

export type Chatroom = {
  id: number;
  createdAt: string;
  updatedAt: string;
  fromId: number;
  toId: number;
};

export type Message = {
  id: number;
  createdAt: string;
  updatedAt: string;
  conversationId: number;
  userId: number;
  content: string;
};

// Error types

export type HttpErrorMap = {
  200: "OK";
  201: "Created";
  202: "Accepted";
  203: "Non-Authoritative Information";
  204: "No Content";
  205: "Reset Content";
  206: "Partial Content";
  207: "Multi-Status (WebDAV)";
  208: "Already Reported (WebDAV)";
  226: "IM Used";
  300: "Multiple Choices";
  301: "Moved Permanently";
  302: "Found";
  303: "See Other";
  304: "Not Modified";
  305: "Use Proxy";
  306: "(Unused)";
  307: "Temporary Redirect";
  308: "Permanent Redirect (experimental)";
  400: "Bad Request";
  401: "Unauthorized";
  402: "Payment Required";
  403: "Forbidden";
  404: "Not Found";
  405: "Method Not Allowed";
  406: "Not Acceptable";
  407: "Proxy Authentication Required";
  408: "Request Timeout";
  409: "Conflict";
  410: "Gone";
  411: "Length Required";
  412: "Precondition Failed";
  413: "Request Entity Too Large";
  414: "Request-URI Too Long";
  415: "Unsupported Media Type";
  416: "Requested Range Not Satisfiable";
  417: "Expectation Failed";
  418: "I'm a teapot (RFC 2324)";
  420: "Enhance Your Calm (Twitter)";
  422: "Unprocessable Entity (WebDAV)";
  423: "Locked (WebDAV)";
  424: "Failed Dependency (WebDAV)";
  425: "Reserved for WebDAV";
  426: "Upgrade Required";
  428: "Precondition Required";
  429: "Too Many Requests";
  431: "Request Header Fields Too Large";
  444: "No Response (Nginx)";
  449: "Retry With (Microsoft)";
  450: "Blocked by Windows Parental Controls (Microsoft)";
  451: "Unavailable For Legal Reasons";
  499: "Client Closed Request (Nginx)";
  500: "Internal Server Error";
  501: "Not Implemented";
  502: "Bad Gateway";
  503: "Service Unavailable";
  504: "Gateway Timeout";
  505: "HTTP Version Not Supported";
  506: "Variant Also Negotiates (Experimental)";
  507: "Insufficient Storage (WebDAV)";
  508: "Loop Detected (WebDAV)";
  509: "Bandwidth Limit Exceeded (Apache)";
  510: "Not Extended";
  511: "Network Authentication Required";
  598: "Network read timeout error";
  599: "Network connect timeout error";
};

export type HttpErrorCode = keyof HttpErrorMap;

export type ApiError = {
  readonly code: HttpErrorCode;
  readonly message: string;
  readonly reason: HttpErrorMap[HttpErrorCode];
};
