import { Link } from "react-router-dom";
import { ApiGetConversationsResponse } from "../../api/api.types";
import { Avatar } from "../../components/default/Avatar";
import { CenterLoader } from "../../components/default/Loader";
import { useSession } from "../../hooks/auth/useSession";
import { useConversations } from "../../hooks/chatrooms/useConversations";
import cx from "classnames";
import formatRelative from "date-fns/formatRelative";

export default function MessagesPage() {
  const [conversations, loading] = useConversations();
  return (
    <div className="flex flex-col gap-2">
      <h1 className="mb-4 text-4xl font-black">Messages</h1>
      {loading ? <CenterLoader /> : null}
      {conversations?.map((conversation) => (
        <ConversationPreview
          conversation={conversation}
          key={conversation.id}
        />
      ))}
    </div>
  );
}

function ConversationPreview({
  conversation,
}: {
  conversation: ApiGetConversationsResponse[number];
}) {
  const { data: session } = useSession();
  const talkingTo =
    conversation.fromId === session?.user?.id
      ? conversation.to
      : conversation.from;
  const hasMessages = conversation.messages.length > 0;
  const messagePreview = hasMessages
    ? conversation.messages[0]?.content.slice(0, 30) + "..."
    : "No messages yet. Hit them up!";
  return (
    <Link
      to={`/messages/${conversation.id}`}
      key={conversation.id}
      className="flex gap-2 rounded-md border p-2"
    >
      <Avatar user={talkingTo} />
      <div className="flex w-full flex-col">
        <div className="flex justify-between">
          <strong className="font-black">
            {talkingTo.firstname} {talkingTo.lastname}
          </strong>
          {hasMessages ? (
            <p className="text-gray-500">
              {formatRelative(
                new Date(conversation.messages[0]?.createdAt),
                new Date(),
                { weekStartsOn: 1 }
              )}
            </p>
          ) : null}
        </div>
        <p
          className={cx({
            "text-gray-500": hasMessages,
            "text-green-500": !hasMessages,
          })}
        >
          {messagePreview}
        </p>
      </div>
    </Link>
  );
}
