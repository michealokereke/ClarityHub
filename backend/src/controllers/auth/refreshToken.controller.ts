import { RequestHandler } from "express";
import { errorFormat } from "../../utils/errorFormat";
import { BAD_REQUEST, NOT_FOUND, UNAUTHORIZED } from "../../utils/getEnv";
import { setCookies } from "../../utils/setCookies";
import {
  signAccessToken,
  signRefreshToken,
  verifyRefreshToken,
} from "../../utils/jwt";
import { findById } from "../../services/userModel.service";
import { findRefreshFamilyToken } from "../../services/tokenFamily.service";
import { getuuidv4 } from "../../utils/uuidv4";
import { authExtractorType } from "../../middleware/authExtractor.middleware";

const refreshTokenController: RequestHandler = async (
  req: authExtractorType,
  res,
  next
) => {
  const reqRefreshToken = req.cookies.ch_refresh;
  if (!reqRefreshToken) throw errorFormat("No Token", BAD_REQUEST);
  const verifiedReqRefreshToken = verifyRefreshToken(reqRefreshToken);
  if (!verifiedReqRefreshToken || typeof verifiedReqRefreshToken === "string")
    throw errorFormat("Invalid or expired token", BAD_REQUEST);

  console.log(verifiedReqRefreshToken);

  const refreshTokenFamily = await findRefreshFamilyToken({
    userId: verifiedReqRefreshToken.userId,
    familyId: verifiedReqRefreshToken.familyId,
  });

  if (!refreshTokenFamily) throw errorFormat("no tokenFamily found", NOT_FOUND);

  if (refreshTokenFamily.currentTokenId !== verifiedReqRefreshToken.jti) {
    refreshTokenFamily.revokedAt = new Date();
    await refreshTokenFamily.save();
    throw errorFormat("reuse detected", BAD_REQUEST);
  }

  if (refreshTokenFamily.revokedAt)
    throw errorFormat("token expired", BAD_REQUEST);

  const tokenId = getuuidv4();
  refreshTokenFamily.currentTokenId = tokenId;
  await refreshTokenFamily.save();

  const refreshToken = signRefreshToken({
    jti: refreshTokenFamily.currentTokenId,
    familyId: refreshTokenFamily.familyId,
    userId: refreshTokenFamily.userId,
  });

  const user = await findById(refreshTokenFamily.userId);

  if (!user) throw errorFormat("user not found", NOT_FOUND);

  const token = signAccessToken({
    userId: user._id.toString(),
    tenantId: user.tenantId.toString(),
    role: user.role,
  });

  setCookies(res, "ch_access", token, 15 * 60 * 1000);
  setCookies(res, "ch_refresh", refreshToken, 30 * 24 * 60 * 60 * 1000);

  res.json({ message: "new access token created" });
};

export default refreshTokenController;
