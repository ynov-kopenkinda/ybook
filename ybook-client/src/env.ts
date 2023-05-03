import { z } from "zod";

export const formatErrors = (
  errors: z.ZodFormattedError<Map<string, string>, string>
) =>
  Object.entries(errors)
    .map(([name, value]) => {
      if (value && "_errors" in value)
        return `${name}: ${value._errors.join(", ")}\n`;
    })
    .filter(Boolean);

export const envSchema = z.object({
  NODE_ENV: z.enum(["development", "production", "test"]),
  REACT_APP_BACKEND_URL: z.string().url(),
  REACT_APP_COGNITO_CLIENT_ID: z.string().min(1),
  REACT_APP_COGNITO_USERPOOL_ID: z.string().min(1),
});

const _env = envSchema.safeParse({
  NODE_ENV: process.env.NODE_ENV,
  REACT_APP_BACKEND_URL: process.env.REACT_APP_BACKEND_URL,
  REACT_APP_COGNITO_CLIENT_ID: process.env.REACT_APP_COGNITO_CLIENT_ID,
  REACT_APP_COGNITO_USERPOOL_ID: process.env.REACT_APP_COGNITO_USERPOOL_ID,
});

if (!_env.success) {
  console.error(formatErrors(_env.error.format()));
  throw new Error("Invalid environment variables");
}

Object.keys(_env.data).forEach((key) => {
  if (!key.startsWith("REACT_APP_"))
    console.warn("Warning, exposing serverside env variable: ", key);
});

export const env = _env.data;
