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
exports.s3Controller = void 0;
const session_middleware_1 = require("../_middlewares/session.middleware");
const s3 = require("../_aws/s3");
const validateSchema_1 = require("../_utils/validateSchema");
const zod_1 = require("zod");
const error_middleware_1 = require("../_middlewares/error.middleware");
exports.s3Controller = {
    api_sendToS3: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const session = yield (0, session_middleware_1.extractSession)(res);
        const { url, key } = yield s3.getSignedPostUrl(session.user.id);
        return res.json({ url, key });
    }),
    api_getFromS3: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const s3Key = (0, validateSchema_1.validateSchema)(zod_1.z.string(), req.query.s3key);
        if (s3Key === "") {
            throw new error_middleware_1.ApiError(400, "Invalid s3 key");
        }
        const url = yield s3.getSignedGetUrl(s3Key);
        return res.json({ url });
    }),
};
//# sourceMappingURL=s3.controller.js.map