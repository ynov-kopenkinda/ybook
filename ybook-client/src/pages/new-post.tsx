import { IconSend } from "@tabler/icons-react";
import { convertToRaw, EditorState } from "draft-js";
import draftToHtml from "draftjs-to-html";
import { useMemo, useState } from "react";
import { Editor } from "react-draft-wysiwyg";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import { useNavigate } from "react-router";
import { useCreatePost } from "../hooks/posts/useCreatePost";

export default function NewPostPage() {
  const [editorState, setEditorState] = useState(EditorState.createEmpty());
  const navigate = useNavigate();
  const markup = useMemo(
    () => draftToHtml(convertToRaw(editorState.getCurrentContent())),
    [editorState]
  );
  const createPost = useCreatePost();

  return (
    <div className="flex flex-col gap-2">
      <h1 className="mb-4 text-4xl font-black">New post</h1>
      <div className="overflow-hidden rounded-md border">
        <Editor
          editorState={editorState}
          onEditorStateChange={setEditorState}
          editorClassName="p-4"
          toolbarClassName="flex sticky top-0 z-50 !justify-center mx-auto border-t-0 border-l-0 border-r-0 border-b border-gray-200"
          toolbar={{
            options: ["inline", "list", "textAlign"],
          }}
        />
        <div className="w-full px-2 pb-2">
          <button
            onClick={async () => {
              const [post, error] = await createPost({ content: markup });
              if (error) {
                return;
              }
              navigate(`/post/${post.id}`);
            }}
            className="flex w-full items-center justify-center gap-2 rounded-md bg-blue-500 p-2 text-white disabled:bg-blue-300 disabled:text-gray-500"
            disabled={markup === "<p></p>\n"}
          >
            <span>Submit</span>
            <IconSend stroke={1} />
          </button>
        </div>
      </div>
    </div>
  );
}
