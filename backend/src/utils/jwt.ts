import { JwtPayload, sign, verify } from "jsonwebtoken";
import { JWT_REFRESH_SECRET, JWT_SECRET } from "./getEnv";
import { Types } from "mongoose";

export interface accessTokenTypes {
  userId: string;
  tenantId: string;
  role: string;
}

export const signAccessToken = (user: accessTokenTypes) =>
  sign(user, JWT_SECRET, { expiresIn: "15m" });

export const signRefreshToken = (payload: {
  jti: string;
  familyId: string;
  userId: Types.ObjectId;
}) => sign(payload, JWT_REFRESH_SECRET, { expiresIn: "15m" });

export const verifyAccessToken = (token: string) => verify(token, JWT_SECRET);

export const verifyRefreshToken = (token: string) =>
  verify(token, JWT_REFRESH_SECRET);
