import { RequestHandler } from "express";
import { findOne } from "../../services/userModel.service";
import { errorFormat } from "../../utils/errorFormat";
import { BAD_REQUEST, NOT_FOUND, OK } from "../../utils/getEnv";
import { signAccessToken, signRefreshToken } from "../../utils/jwt";
import { setCookies } from "../../utils/setCookies";
import { getuuidv4 } from "../../utils/uuidv4";
import {
  createRefreshTokenFamily,
  findRefreshTokenFamilyByUserId,
  refreshTokenFamilyType,
} from "../../services/tokenFamily.service";

const loginController: RequestHandler = async (req, res, next) => {
  const { email, password } = req.body;
  const user = await findOne(email);

  if (!user) throw errorFormat("invalid credentials", NOT_FOUND);

  const valid = await user.comparePassword(password);
  if (!valid) throw errorFormat("wrong credential", BAD_REQUEST);
  if (user.status !== "active")
    throw errorFormat("not active user", BAD_REQUEST);

  let refreshTokenFamily = await findRefreshTokenFamilyByUserId(user._id);

  if (!refreshTokenFamily)
    throw errorFormat("no refresh Token Family seen", NOT_FOUND);

  if (refreshTokenFamily.revokedAt) {
    const tokenFamilyDocs: refreshTokenFamilyType = {
      tenantId: user.tenantId.toString(),
      userId: user._id,
      familyId: getuuidv4(),
      currentTokenId: getuuidv4(),
    };

    refreshTokenFamily = await createRefreshTokenFamily(tokenFamilyDocs);
  } else {
    const tokenId = getuuidv4();
    refreshTokenFamily.currentTokenId = tokenId;
    await refreshTokenFamily.save();
  }

  const token = signAccessToken({
    userId: user._id.toString(),
    tenantId: user.tenantId.toString(),
    role: user.role,
  });

  const refreshToken = signRefreshToken({
    jti: refreshTokenFamily.currentTokenId,
    familyId: refreshTokenFamily.familyId,
    userId: refreshTokenFamily.userId,
  });

  setCookies(res, "ch_access", token, 15 * 60 * 1000);
  setCookies(res, "ch_refresh", refreshToken, 30 * 24 * 60 * 60 * 1000);

  user.lastLoginAt = new Date();

  await user.save();
  const userReturned = user.deletePassword();
  res.status(OK).json({ user: userReturned });
};

export default loginController;
