"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateSchema = void 0;
const error_middleware_1 = require("../_middlewares/error.middleware");
function validateSchema(schema, obj) {
    const result = schema.safeParse(obj);
    if (!result.success) {
        throw new error_middleware_1.ApiError(400, result.error.issues.map((issue) => issue.message).join(", "));
    }
    return result.data;
}
exports.validateSchema = validateSchema;
//# sourceMappingURL=validateSchema.js.map