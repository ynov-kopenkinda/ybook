import { IconHeart, IconMessage } from "@tabler/icons-react";
import cx from "classnames";
import DOMPurify from "dompurify";
import { Navigate, useParams } from "react-router";
import { z } from "zod";
import { Avatar } from "../../components/default/Avatar";
import { Loader } from "../../components/default/Loader";
import { ReplyToPost } from "../../components/posts/ReplyToPost";
import { useSession } from "../../hooks/auth/useSession";
import { useLikePost } from "../../hooks/posts/useLikePost";
import { usePost } from "../../hooks/posts/usePost";
import { useProfilePopup } from "../../store/profile.store";

export default function PostPage() {
  const parsedParams = z.coerce.number().safeParse(useParams().id);
  const id = parsedParams.success ? parsedParams.data : NaN;
  const { isLoading, post } = usePost(Number.isNaN(id) ? undefined : id);
  const { data: session } = useSession();
  const like = useLikePost(id);
  const { open } = useProfilePopup();
  if (isLoading)
    return (
      <div className="flex items-center justify-center py-16">
        <Loader />
      </div>
    );
  if (!parsedParams.success || post === undefined) {
    return <Navigate to="/" />;
  }
  const likedByMe = post.postLikes.some(
    (like) => like.user.email === session?.email
  );
  const hasMyComments = post.postComments.some(
    (comment) => comment.user.email === session?.email
  );
  return (
    <div className="flex flex-col gap-2">
      <h1 className="mb-4 text-4xl font-black">Publication</h1>
      <div className="flex flex-col gap-2 rounded-md border p-4">
        <button
          className="flex items-center gap-2"
          onClick={() => open(post.user)}
        >
          <Avatar user={post.user} />
          <span className=" inline-block text-lg font-bold">
            {post.user.firstname} {post.user.lastname}
          </span>
        </button>
        <div
          className="prose prose-sm"
          dangerouslySetInnerHTML={{
            __html: DOMPurify.sanitize(post.htmlContent),
          }}
        />
        <hr />
        <div className="flex justify-between">
          <button
            className="text-md flex items-center py-2 pr-2"
            onClick={() => like({ postId: post.id })}
          >
            <IconHeart
              stroke={1}
              className={cx({ "fill-red-500 text-red-500": likedByMe })}
            />
            {post.postLikes.length}
          </button>
          <span className="text-md flex items-center py-2">
            <IconMessage
              stroke={1}
              className={cx({ "fill-slate-700 text-slate-700": hasMyComments })}
            />{" "}
            {post.postComments.length}
          </span>
        </div>
        {post.postComments.length > 0 && <hr />}
        {post.postComments.map((comment) => (
          <div className="flex flex-col gap-2" key={comment.id}>
            <span className="inline-block text-lg font-bold">
              {comment.user.firstname} {comment.user.lastname}
            </span>
            <div
              className="prose prose-sm"
              dangerouslySetInnerHTML={{
                __html: DOMPurify.sanitize(comment.text ?? ""),
              }}
            />
          </div>
        ))}
        <ReplyToPost postId={post.id} />
      </div>
    </div>
  );
}
