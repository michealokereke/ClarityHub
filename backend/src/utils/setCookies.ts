import { Response } from "express";
import { NODE_ENV } from "./getEnv";

export const setCookies = (
  res: Response,
  name: string,
  token: string,
  expires: number
) => {
  res.cookie(name, token, {
    maxAge: expires,
    path: "/",
    sameSite: "strict",
    httpOnly: true,
    secure: NODE_ENV === "production",
  });
};

export const clearCookie = (res: Response, name: string) => {
  res.clearCookie(name, {
    path: "/",
    httpOnly: true,
    sameSite: "strict",
    secure: NODE_ENV === "production",
  });
};
