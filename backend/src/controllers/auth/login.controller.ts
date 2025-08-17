import { RequestHandler } from "express";
import { findOne } from "../../services/userExists.service";
import { errorFormat } from "../../utils/errorFormat";
import { BAD_REQUEST, NOT_FOUND } from "../../utils/getEnv";
import { signAccessToken, signRefreshToken } from "../../utils/jwt";
import { setCookies } from "../../utils/setCookies";
import { storeToken } from "../../services/storeToken.service";

const loginController: RequestHandler = async (req, res, next) => {
  const { email, password } = req.body;
  const user = await findOne(email);
  const userAgent = req.headers["user-agent"];
  if (!userAgent) throw errorFormat("no user agent");

  if (!user) throw errorFormat("user not found", NOT_FOUND);

  const valid = await user.comparePassword(password);
  if (!valid) throw errorFormat("wrong credential", BAD_REQUEST);

  const token = signAccessToken({
    userId: user._id.toString(),
    role: user.role,
  });

  const refreshToken = signRefreshToken({
    userId: user._id.toString(),
    role: user.role,
    email: user.email,
  });

  const storedRefreshToken = await storeToken(
    user._id,
    refreshToken,
    userAgent
  );

  setCookies(res, "ch_access", token, 15 * 60 * 1000, "/api/auth/accessToken");
  setCookies(
    res,
    "ch_refresh",
    refreshToken,
    24 * 60 * 60 * 1000,
    "/api/auth/refreshToken"
  );
  const userReturned = user.deletePassword();
  res.json(userReturned);
};

export default loginController;
