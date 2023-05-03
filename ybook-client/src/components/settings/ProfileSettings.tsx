import { IconUpload } from "@tabler/icons-react";
import { api } from "../../api";
import { useSession } from "../../hooks/auth/useSession";
import { useChangeImage } from "../../hooks/users/useChangeAvatar";
import { Avatar } from "../default/Avatar";
import { CenterLoader } from "../default/Loader";

export function ProfileSettings() {
  const { data: session } = useSession();
  const updateAvatarImage = useChangeImage("avatar");
  const updateCoverImage = useChangeImage("cover");

  if (session == null) return <CenterLoader />;

  const chageImage = (type: "avatar" | "cover" = "avatar") => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.click();
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file == null) return;
      const [s3uploadResponse, error] = await api.s3.getUploadUrl();
      if (error !== null) return;
      const uploadRes = await fetch(s3uploadResponse.url, {
        method: "PUT",
        body: file,
        headers: {
          "Content-Type": file.type,
        },
      });
      if (uploadRes.status !== 200) {
        return;
      }
      if (type === "cover") {
        await updateCoverImage({ s3key: s3uploadResponse.key });
      } else {
        await updateAvatarImage({ s3key: s3uploadResponse.key });
      }
    };
  };

  return (
    <div className="flex gap-2 rounded-md border p-4">
      <Avatar className="h-16 w-16" user={session.user} />
      <div>
        <h1 className="text-xl font-bold">
          {session.user.firstname} {session.user.lastname}
        </h1>
        <p className="text-gray-400">{session.user.email}</p>
        <button
          className="flex w-full items-center justify-center gap-2 rounded-md border border-blue-500 text-sm text-blue-500"
          onClick={() => chageImage("avatar")}
        >
          <IconUpload size={16} stroke={1} />
          <span>Change Avatar</span>
        </button>
        <button
          className="flex w-full items-center justify-center gap-2 rounded-md border border-blue-500 text-sm text-blue-500"
          onClick={() => chageImage("cover")}
        >
          <IconUpload size={16} stroke={1} />
          <span>Change Cover</span>
        </button>
      </div>
    </div>
  );
}
