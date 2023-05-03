import { extractSession } from "../_middlewares/session.middleware";
import type { ApiController } from "../../types";
import * as s3 from "../_aws/s3";
import { validateSchema } from "../_utils/validateSchema";
import { z } from "zod";
import { ApiError } from "../_middlewares/error.middleware";

export const s3Controller = {
  api_sendToS3: async (req, res) => {
    const session = await extractSession(res);
    const { url, key } = await s3.getSignedPostUrl(session.user.id);
    return res.json({ url, key });
  },
  api_getFromS3: async (req, res) => {
    const s3Key = validateSchema(z.string(), req.query.s3key);
    if (s3Key === "") {
      throw new ApiError(400, "Invalid s3 key");
    }
    const url = await s3.getSignedGetUrl(s3Key);
    return res.json({ url });
  },
} satisfies ApiController;
