import { useQueryClient } from "@tanstack/react-query";
import cx from "classnames";
import { forwardRef } from "react";
import { ApiGetMessagesResponse } from "../../api/api.types";
import { useSession } from "../../hooks/auth/useSession";
import { useLiveMessages } from "../../hooks/chatrooms/useLiveMessages";
import {
  useMessages,
  USE_MESSAGES_KEY
} from "../../hooks/chatrooms/useMessages";
import { CenterLoader } from "../default/Loader";

export function ChatWindow({ chatroomId }: { chatroomId: number }) {
  const [messages, loading] = useMessages({ chatroomId });
  const queryClient = useQueryClient();
  const { data: session } = useSession();
  useLiveMessages({
    chatroomId,
    onReceive(message) {
      console.log("Received message", message);
      queryClient.setQueryData([USE_MESSAGES_KEY, chatroomId], (old: any) => {
        return [...old, message];
      });
    },
  });
  if (loading) {
    return <CenterLoader />;
  }
  return (
    <>
      <div className="flex h-full flex-col gap-2">
        {messages?.map((message) => (
          <Message
            message={message}
            own={message.userId === session?.user.id}
            key={message.id}
          />
        ))}
      </div>
    </>
  );
}

const Message = forwardRef<
  HTMLDivElement,
  { message: ApiGetMessagesResponse[number]; own: boolean }
>(function ({ message, own }, ref) {
  return (
    <div
      className={cx("flex w-3/5 flex-col rounded-md p-2", {
        "border bg-gray-200 text-black": !own,
        "self-end bg-blue-500 text-white": own,
      })}
    >
      <strong className="font-bold">
        {message.from.firstname} {message.from.lastname}
      </strong>
      {message.content}
    </div>
  );
});
