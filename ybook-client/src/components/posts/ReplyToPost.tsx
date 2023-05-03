import { IconSend } from "@tabler/icons-react";
import { useState } from "react";
import { useSession } from "../../hooks/auth/useSession";
import { useReplyToPost } from "../../hooks/posts/useReplyToPost";

export function ReplyToPost({ postId }: { postId: number }) {
  const { data: session } = useSession();
  const [content, setContent] = useState("");
  const { mutateAsync: reply, isLoading } = useReplyToPost(postId);
  if (session == null) return <></>;
  return (
    <form
      className="flex flex-col gap-2"
      onSubmit={async (e) => {
        e.preventDefault();
        if (content.trim() === "") return;
        await reply({ postId, content });
        setContent("");
      }}
    >
      <div className="flex flex-col">
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value.slice(0, 250))}
          disabled={isLoading}
          className="flex-1 resize-none rounded-md border p-2"
        />
        <small className="ml-auto text-xs">{content.length}/250</small>
      </div>
      <button
        className="flex items-center justify-center gap-2 rounded-md bg-blue-500 p-2 text-white disabled:bg-blue-300 disabled:text-gray-500"
        disabled={content.trim().length === 0}
      >
        Reply
        <IconSend stroke={1} />
      </button>
    </form>
  );
}
