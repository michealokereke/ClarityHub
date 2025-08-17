import { JwtPayload, sign, verify } from "jsonwebtoken";
import { JWT_REFRESH_SECRET, JWT_SECRET } from "./getEnv";

export const signAccessToken = (user: { userId: string; role: string }) =>
  sign(user, JWT_SECRET, { expiresIn: "15m" });

export const signRefreshToken = (user: {
  userId: string;
  email: string;
  role: string;
}) => sign(user, JWT_REFRESH_SECRET, { expiresIn: "15m" });

export const verifyAccessToken = (token: string) => verify(token, JWT_SECRET);

export const verifyRefreshToken = (token: string) =>
  verify(token, JWT_REFRESH_SECRET);
