export const getEnv = (value: string, defaultValue?: string): string => {
  const env = process.env[value] || defaultValue;
  if (!env) {
    throw new Error(`missing variable ${value}`);
  }
  return env;
};

export const numberEnv = (value: string, defaultValue?: number): number => {
  const env = process.env[value] || defaultValue;
  const numberenv = Number(env);

  if (!numberEnv) {
    throw new Error(`missing variable ${value}`);
  }
  return numberenv;
};

export const CLIENT_URL = getEnv("CLIENT_URL");
export const PORT = getEnv("PORT", "5000");
export const MONGO_URI = getEnv("MONGO_URI");
export const JWT_SECRET = getEnv("JWT_SECRET");
export const JWT_REFRESH_SECRET = getEnv("JWT_REFRESH_SECRET");
export const STRIPE_SECRET_KEY = getEnv("STRIPE_SECRET_KEY");
export const CLOUDINARY_CLOUD_NAME = getEnv("CLOUDINARY_CLOUD_NAME");
export const CLOUDINARY_API_KEY = getEnv("CLOUDINARY_API_KEY");
export const CLOUDINARY_API_SECRET = getEnv("CLOUDINARY_API_SECRET");
export const NODE_ENV = getEnv("NODE_ENV", "development");

export const OK = numberEnv("OK", 200);
export const CREATED = numberEnv("CREATED", 201);
export const BAD_REQUEST = numberEnv("BAD_REQUEST", 400);
export const UNAUTHORIZED = numberEnv("UNAUTHORIZED", 401);
export const NOT_FOUND = numberEnv("NOT_FOUND", 404);
export const INTERNAL_SERVER_ERROR = numberEnv("INTERNAL_SERVER_ERROR", 500);
