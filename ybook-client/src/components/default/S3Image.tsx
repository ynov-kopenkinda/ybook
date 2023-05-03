import {
  DetailedHTMLProps,
  forwardRef,
  HTMLAttributes,
  useEffect,
  useState,
} from "react";
import { useS3Image } from "../../hooks/users/useS3Image";

export const S3Image = forwardRef<
  HTMLImageElement,
  DetailedHTMLProps<HTMLAttributes<HTMLImageElement>, HTMLImageElement> & {
    s3Key: string | null;
    fallbackUrl: string;
    alt?: string;
  }
>(function ({ s3Key, alt, onError, fallbackUrl, ...props }, ref) {
  const imageUrl = useS3Image(s3Key);
  const [url, setUrl] = useState(imageUrl ?? fallbackUrl);
  useEffect(() => {
    setUrl(imageUrl ?? fallbackUrl);
  }, [fallbackUrl, imageUrl]);
  return (
    <img
      ref={ref}
      loading="lazy"
      src={url}
      alt={alt}
      role={props.role ?? alt === undefined ? "presentation" : undefined}
      onError={(e) => {
        setUrl(fallbackUrl);
        onError?.(e);
      }}
      {...props}
    />
  );
});
