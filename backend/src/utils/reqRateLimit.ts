import rateLimit from "express-rate-limit";
import { BAD_REQUEST } from "./getEnv";

export const reqRateLimitPerMinute = (max: number) => {
  return rateLimit({
    windowMs: 1 * 60 * 1000,
    max,
    standardHeaders: true,
    legacyHeaders: false,
    message: {
      status: BAD_REQUEST,
      error: "Too many requests for this route, please try again later.",
    },
  });
};
