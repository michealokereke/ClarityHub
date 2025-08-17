import { RequestHandler } from "express";
import { refreshTokenReq } from "../../middleware/refreshValidator.middleware";
import { errorFormat } from "../../utils/errorFormat";
import { BAD_REQUEST } from "../../utils/getEnv";
import { clearCookie } from "../../utils/setCookies";

const logoutController: RequestHandler = async (
  req: refreshTokenReq,
  res,
  next
) => {
  if (!req.refreshTokenDoc)
    throw errorFormat("refresh token missing", BAD_REQUEST);

  const refreshTokenDoc = req.refreshTokenDoc;
  refreshTokenDoc.revoked = true;
  await refreshTokenDoc.save();

  clearCookie(res, "ch_refresh", "/api/auth/refreshToken");
  clearCookie(res, "ch_access", "/api/auth/accessToken");

  res.json({ message: "user logout successfully", refreshTokenDoc });
};

export default logoutController;
