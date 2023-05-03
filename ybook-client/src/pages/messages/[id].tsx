import { IconChevronLeft } from "@tabler/icons-react";
import { Link, Navigate, useParams } from "react-router-dom";
import { z } from "zod";
import { ChatWindow } from "../../components/chatroom/Chat";
import { MessageBox } from "../../components/chatroom/MessageBox";
import { CenterLoader } from "../../components/default/Loader";
import { S3Image } from "../../components/default/S3Image";
import { useSession } from "../../hooks/auth/useSession";
import { useConversation } from "../../hooks/chatrooms/useConversation";

const DEFAULT_COVER_PIC = "/chat-banner-default.jpeg";

export default function ConversationPage() {
  const parsedParams = z.coerce.number().safeParse(useParams().id);
  const id = parsedParams.success ? parsedParams.data : null;

  const [conversation, isConversationLoading] = useConversation(id);
  const { data: session } = useSession();

  if (isConversationLoading) {
    return <CenterLoader />;
  }
  if (!parsedParams.success || conversation === undefined || session == null) {
    return <Navigate to="/messages" />;
  }

  const talkingTo =
    conversation.fromId === session.user.id
      ? conversation.to
      : conversation.from;

  return (
    <div className="flex h-full flex-col gap-2 pt-20">
      <div className="fixed top-0 left-0 right-0 flex h-16 items-center">
        <div className="absolute -z-10 inline-block h-full w-full after:absolute after:inset-0 after:bg-black/60 bg-white">
          <S3Image
            s3Key={talkingTo.coverPicS3Key}
            fallbackUrl={DEFAULT_COVER_PIC}
            className="h-full w-full object-cover"
          />
        </div>
        <h1 className="flex items-center gap-2 text-4xl font-black text-white">
          <Link to="/messages" className="text-white">
            <IconChevronLeft size={32} stroke={2} />
          </Link>
          Chatroom #{id}
        </h1>
      </div>
      <ChatWindow chatroomId={id!} />
      <MessageBox conversationId={id!} />
    </div>
  );
}
