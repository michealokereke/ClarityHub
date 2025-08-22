import { RequestHandler, Request } from "express";
import { accessTokenTypes, verifyAccessToken } from "../utils/jwt";
import { clearCookie } from "../utils/setCookies";

export interface authExtractorType extends Request {
  user?: accessTokenTypes | null;
}

export const authExtractor: RequestHandler = (
  req: authExtractorType,
  res,
  next
) => {
  const accessToken = req.cookies.ch_access;

  if (!accessToken) {
    req.user = null;
    return next();
  }

  try {
    const decoded = verifyAccessToken(accessToken);

    if (!decoded || typeof decoded === "string") {
      clearCookie(res, "ch_access");
      req.user = null;
      return next();
    } else {
      req.user = {
        userId: decoded.userId,
        tenantId: decoded.tenantId,

        role: decoded.role,
      };

      return next();
    }
  } catch (error) {
    console.log(error);
    clearCookie(res, "ch_access");
    req.user = null;
    return next();
  }
};
