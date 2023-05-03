"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSignedGetUrl = exports.getSignedPostUrl = exports.getBucketParams = exports.s3client = void 0;
const aws = require("@aws-sdk/client-s3");
const s3RequestPresigner = require("@aws-sdk/s3-request-presigner");
const env_1 = require("../../env");
exports.s3client = new aws.S3({
    region: env_1.env.AWS_S3_REGION,
    credentials: {
        accessKeyId: env_1.env.AWS_S3_ACCESS_KEY_ID,
        secretAccessKey: env_1.env.AWS_S3_SECRET_ACCESS_KEY,
    },
});
const getBucketParams = (id) => ({
    Bucket: env_1.env.AWS_S3_BUCKET_NAME,
    Key: `kopenkinda-ybook/${id}/${Date.now() + Math.random()}`,
    ContentType: "image/*",
});
exports.getBucketParams = getBucketParams;
const getSignedPostUrl = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const params = (0, exports.getBucketParams)(id);
    return {
        url: yield s3RequestPresigner.getSignedUrl(exports.s3client, new aws.PutObjectCommand(params), {
            expiresIn: 60,
        }),
        key: params.Key,
    };
});
exports.getSignedPostUrl = getSignedPostUrl;
const getSignedGetUrl = (s3key) => __awaiter(void 0, void 0, void 0, function* () {
    const params = {
        Bucket: env_1.env.AWS_S3_BUCKET_NAME,
        Key: s3key,
    };
    const command = new aws.GetObjectCommand(params);
    return yield s3RequestPresigner.getSignedUrl(exports.s3client, command, {
        expiresIn: 300,
    });
});
exports.getSignedGetUrl = getSignedGetUrl;
//# sourceMappingURL=s3.js.map