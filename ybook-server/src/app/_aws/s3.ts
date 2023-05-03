import * as aws from "@aws-sdk/client-s3";
import * as s3RequestPresigner from "@aws-sdk/s3-request-presigner";
import type { User } from "@prisma/client";
import { env } from "../../env";

export const s3client = new aws.S3({
  region: env.AWS_S3_REGION,
  credentials: {
    accessKeyId: env.AWS_S3_ACCESS_KEY_ID,
    secretAccessKey: env.AWS_S3_SECRET_ACCESS_KEY,
  },
});

export const getBucketParams = (id: User["id"]) => ({
  Bucket: env.AWS_S3_BUCKET_NAME,
  Key: `kopenkinda-ybook/${id}/${Date.now() + Math.random()}`,
  ContentType: "image/*",
});

export const getSignedPostUrl = async (id: User["id"]) => {
  const params = getBucketParams(id);
  return {
    url: await s3RequestPresigner.getSignedUrl(
      s3client,
      new aws.PutObjectCommand(params),
      {
        expiresIn: 60,
      }
    ),
    key: params.Key,
  };
};

export const getSignedGetUrl = async (s3key: string) => {
  const params = {
    Bucket: env.AWS_S3_BUCKET_NAME,
    Key: s3key,
  };
  const command = new aws.GetObjectCommand(params);
  return await s3RequestPresigner.getSignedUrl(s3client, command, {
    expiresIn: 300,
  });
};
