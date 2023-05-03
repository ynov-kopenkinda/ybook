import {
  IconMessage,
  IconUserCheck,
  IconUserOff,
  IconUserPlus,
  IconUserX,
} from "@tabler/icons-react";
import cx from "classnames";
import { useNavigate } from "react-router-dom";
import { Session, User } from "../../api/api.types";
import { useSession } from "../../hooks/auth/useSession";
import { useStartConversation } from "../../hooks/chatrooms/useStartConversation";
import { useRemoveFriendship } from "../../hooks/friends/useRemoveFriendship";
import { useSendFriendRequest } from "../../hooks/friends/useSendFriendRequest";
import { useBlockUser } from "../../hooks/users/useBlockUser";
import { useDetailedUser } from "../../hooks/users/useDetailedUser";
import { useUnblockUser } from "../../hooks/users/useUnblockUser";
import { useProfilePopup } from "../../store/profile.store";
import { Avatar } from "./Avatar";
import { CenterLoader } from "./Loader";

export function ProfilePreview() {
  return (
    <>
      <ProfilePreviewOverlay />
      <ProfilePreviewCard />
    </>
  );
}

function ProfilePreviewOverlay() {
  const { close, user } = useProfilePopup();
  return (
    <div
      className={cx("fixed inset-0 z-40 bg-black/60 transition-opacity", {
        "translate-y-full opacity-0": user === null,
        "opacity-1 translate-y-0": user !== null,
      })}
      onClick={() => close()}
    />
  );
}

function ProfilePreviewCard() {
  const { user } = useProfilePopup();
  const { data: session } = useSession();
  return (
    <div
      className={cx(
        "fixed bottom-0 left-0 right-0 z-50 flex h-[512px] flex-col items-center gap-2 rounded-md bg-white p-4 pt-16 transition-transform",
        {
          "translate-y-full": user === null,
          "translate-y-0": user !== null,
        }
      )}
    >
      {user !== null && session != null ? (
        <ProfilePreviewCardInner user={user} session={session} />
      ) : null}
    </div>
  );
}

function ProfilePreviewCardInner({
  user,
  session,
}: {
  user: User;
  session: Session;
}) {
  const [details, detailsLoading] = useDetailedUser({ user });
  const isFriend = details?.friends
    .map((friend) => friend.id)
    .includes(session.user.id);
  const isBlocked =
    details?.user?.blockedByUsers.map((u) => u.id).includes(user.id) ||
    session.user.blockedUsers.map((u) => u.id).includes(user.id);
  const isYou = user.id === session.user.id;
  return (
    <>
      <div className="absolute left-1/2 top-0 flex h-32 w-32 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-2 bg-white">
        <Avatar user={user} className="h-full w-full" />
      </div>
      <h1 className="text-2xl font-black">
        {user.firstname} {user.lastname}
      </h1>
      <p className="text-gray-400">
        <strong className="font-black">#{user.id}</strong> {user.email}{" "}
        {isYou ? "(You)" : null}
      </p>
      {detailsLoading && <CenterLoader />}
      {details !== undefined && !isYou && (
        <div className="flex flex-wrap items-center justify-center gap-2">
          <div className="w-full"></div>
          {isFriend && !isBlocked && <SendMessageButton user={user} />}
          {!isFriend && !isBlocked && details.pending === null && (
            <AddToFriendsButton user={user} />
          )}
          {!isFriend &&
            !isBlocked &&
            details.pending !== null &&
            details.pending.fromId === session.user.id && (
              <CancelFriendRequestButton user={user} />
            )}

          {!isFriend &&
            !isBlocked &&
            details.pending !== null &&
            details.pending.fromId !== session.user.id && (
              <>
                <AcceptFriendRequestButton user={user} />
                <DenyFriendRequestButton user={user} />
              </>
            )}
          {isFriend && !isBlocked && <RemoveFromFriendsButton user={user} />}
          {isBlocked && <UnblockUserButton user={user} />}
          {!isBlocked && <BlockUserButton user={user} />}
        </div>
      )}
    </>
  );
}

function AddToFriendsButton({ user }: { user: User }) {
  const add = useSendFriendRequest({ userId: user.id });
  return (
    <button
      className="flex items-center gap-2 rounded border border-gray-500 p-2 text-sm"
      onClick={() => add()}
    >
      <IconUserPlus stroke={1} /> Add to friends
    </button>
  );
}

function AcceptFriendRequestButton({ user }: { user: User }) {
  const accept = useSendFriendRequest({ userId: user.id });
  return (
    <button
      className="flex items-center gap-2 rounded border border-green-500 p-2 text-sm text-green-500"
      onClick={() => accept()}
    >
      <IconUserCheck stroke={1} /> Accept friend request
    </button>
  );
}

function DenyFriendRequestButton({ user }: { user: User }) {
  const deny = useRemoveFriendship({ userId: user.id });
  return (
    <button
      className="flex items-center gap-2 rounded border border-red-500 p-2 text-sm text-red-500"
      onClick={() => deny()}
    >
      <IconUserX stroke={1} /> Deny friend request
    </button>
  );
}

function RemoveFromFriendsButton({ user }: { user: User }) {
  const remove = useRemoveFriendship({ userId: user.id });
  return (
    <button
      className="flex items-center gap-2 rounded border  border-gray-500 p-2 text-sm"
      onClick={() => remove()}
    >
      <IconUserX stroke={1} /> Remove from friends
    </button>
  );
}

function CancelFriendRequestButton({ user }: { user: User }) {
  const remove = useRemoveFriendship({ userId: user.id });
  return (
    <button
      className="flex items-center gap-2 rounded border  border-gray-500 p-2 text-sm"
      onClick={() => remove()}
    >
      <IconUserX stroke={1} /> Cancel friend request
    </button>
  );
}

function BlockUserButton({ user }: { user: User }) {
  const block = useBlockUser(user.id);
  return (
    <button
      className="flex items-center gap-2 rounded border border-red-500 p-2 text-sm text-red-500"
      onClick={() => block({ userId: user.id })}
    >
      <IconUserOff stroke={1} /> Block user
    </button>
  );
}

function UnblockUserButton({ user }: { user: User }) {
  const unblock = useUnblockUser(user.id);
  return (
    <button
      className="flex items-center gap-2 rounded border border-green-500 p-2 text-sm text-green-500"
      onClick={() => unblock({ userId: user.id })}
    >
      <IconUserCheck stroke={1} /> Unblock user
    </button>
  );
}

function SendMessageButton({ user }: { user: User }) {
  const startConversation = useStartConversation(user.id);
  const { close } = useProfilePopup();
  const navigate = useNavigate();
  return (
    <button
      className="flex items-center gap-2 rounded border border-blue-500 p-2 text-sm text-blue-500"
      onClick={async () => {
        const [data, error] = await startConversation();
        if (error) {
          return;
        }
        navigate(`/messages/${data?.id}`);
        close();
      }}
    >
      <IconMessage stroke={1} />
    </button>
  );
}
