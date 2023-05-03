import { ApiError } from "../_middlewares/error.middleware";

export function validateSchema<T>(schema: Zod.Schema<T>, obj: unknown) {
  const result = schema.safeParse(obj);
  if (!result.success) {
    throw new ApiError(
      400,
      result.error.issues.map((issue) => issue.message).join(", ")
    );
  }
  return result.data;
}
