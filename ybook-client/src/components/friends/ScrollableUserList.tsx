import { User } from "../../api/api.types";
import { CenterLoader } from "../default/Loader";
import { UserPreview } from "./UserPreview";

export function ScrollabeUserList({
  loading,
  users,
  title,
}: {
  loading: boolean;
  users: User[];
  title: string;
}) {
  if (users.length === 0) return null;
  return (
    <>
      <span className="font-black uppercase text-gray-400">{title}</span>
      {loading && <CenterLoader />}
      <div className="relative flex w-full snap-x gap-6 overflow-x-auto py-2">
        {users.map((user) => (
          <UserPreview key={user.id} user={user} />
        ))}
      </div>
    </>
  );
}
