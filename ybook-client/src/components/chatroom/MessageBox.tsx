import { IconSend } from "@tabler/icons-react";
import { useState } from "react";
import { useSendMessage } from "../../hooks/chatrooms/useSendMessage";

export function MessageBox({ conversationId }: { conversationId: number }) {
  const send = useSendMessage({ conversationId });
  const [content, setContent] = useState("");
  return (
    <form
      className="fixed bottom-2 left-2 right-2 flex gap-2 rounded-full border bg-white p-2"
      onSubmit={(e) => {
        e.preventDefault();
        send(content);
        setContent("");
      }}
    >
      <input
        type="text"
        className="w-full rounded-full border-none p-2 outline-none"
        value={content}
        placeholder="Type a message..."
        onChange={(e) => setContent(e.target.value)}
      />
      <button
        type="submit"
        className="aspect-square rounded-full bg-blue-500 p-2 text-white"
      >
        <IconSend />
      </button>
    </form>
  );
}
