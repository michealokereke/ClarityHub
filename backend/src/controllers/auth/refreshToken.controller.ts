import { RequestHandler } from "express";
import { refreshTokenReq } from "../../middleware/refreshValidator.middleware";
import { errorFormat } from "../../utils/errorFormat";
import { BAD_REQUEST, NOT_FOUND } from "../../utils/getEnv";
import { setCookies } from "../../utils/setCookies";
import { signAccessToken, verifyRefreshToken } from "../../utils/jwt";
import { findById } from "../../services/userExists.service";

const refreshTokenController: RequestHandler = async (
  req: refreshTokenReq,
  res,
  next
) => {
  if (!req.refreshTokenDoc)
    throw errorFormat("refresh token missing", BAD_REQUEST);

  const refreshTokenDoc = req.refreshTokenDoc;
  const userAgent = req.headers["user-agent"];
  const reqRefrshTokenToken = req.cookies.ch_refresh;

  if (!reqRefrshTokenToken)
    throw errorFormat("missing refresh token", BAD_REQUEST);
  if (refreshTokenDoc.revoked) throw errorFormat("Token revoked", BAD_REQUEST);
  if (refreshTokenDoc.fingerPrint !== userAgent)
    throw errorFormat("invalid fingerPrint", BAD_REQUEST);

  const decoded = verifyRefreshToken(reqRefrshTokenToken);

  if (!decoded || typeof decoded === "string")
    throw errorFormat("Invalid Token in verify", BAD_REQUEST);

  const user = await findById(decoded.userId);

  if (!user) throw errorFormat("user not found", NOT_FOUND);

  const token = signAccessToken({
    userId: user._id.toString(),
    role: user.role,
  });

  setCookies(res, "ch_access", token, 15 * 60 * 1000, "/api/auth/accessToken");

  res.json({ message: "new access token created" });
};

export default refreshTokenController;
