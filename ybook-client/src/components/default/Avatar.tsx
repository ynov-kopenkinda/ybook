import { lorelei } from "@dicebear/collection";
import { createAvatar } from "@dicebear/core";
import cx from "classnames";
import { DetailedHTMLProps, forwardRef, HTMLAttributes, useMemo } from "react";
import { User } from "../../api/api.types";
import { S3Image } from "./S3Image";

export const Avatar = forwardRef<
  HTMLImageElement,
  DetailedHTMLProps<HTMLAttributes<HTMLImageElement>, HTMLImageElement> & {
    user: User;
  }
>(function ({ user, className = "w-12 h-12", ...props }, ref) {
  const fullname = `${user.firstname} ${user.lastname}`;
  const fallbackUrl = useMemo(() => {
    const avatar = createAvatar(lorelei, {
      seed: fullname,
    });
    return avatar.toDataUriSync();
  }, [fullname]);
  return (
    <S3Image
      s3Key={user.avatarS3Key}
      fallbackUrl={fallbackUrl}
      className={cx("rounded-full", className)}
      alt={fullname}
    />
  );
});
