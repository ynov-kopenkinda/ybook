"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.env = exports.formatErrors = void 0;
const dotenv_1 = require("dotenv");
const zod_1 = require("zod");
(0, dotenv_1.config)();
const formatErrors = (errors) => Object.entries(errors)
    .map(([name, value]) => {
    if (value && "_errors" in value)
        return `${name}: ${value._errors.join(", ")}\n`;
})
    .filter(Boolean);
exports.formatErrors = formatErrors;
const schema = zod_1.z.object({
    NODE_ENV: zod_1.z
        .enum(["development", "production", "test"])
        .default("development"),
    PORT: zod_1.z.coerce.number().default(3001),
    COGNITO_CLIENT_ID: zod_1.z.string().min(1),
    COGNITO_USERPOOL_ID: zod_1.z.string().min(1),
    DATABASE_URL: zod_1.z.string().url(),
    CLIENT_APP_URL: zod_1.z.string().url(),
    AWS_S3_ACCESS_KEY_ID: zod_1.z.string(),
    AWS_S3_SECRET_ACCESS_KEY: zod_1.z.string(),
    AWS_S3_REGION: zod_1.z.string(),
    AWS_S3_BUCKET_NAME: zod_1.z.string(),
});
const _env = schema.safeParse(process.env);
if (!_env.success) {
    console.error("❌ Invalid environment variables:\n", ...(0, exports.formatErrors)(_env.error.format()));
    throw new Error("Invalid environment variables");
}
exports.env = _env.data;
//# sourceMappingURL=env.js.map