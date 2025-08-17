import { RequestHandler } from "express";
import { userExist } from "../../services/userExists.service";
import { BAD_REQUEST, CREATED } from "../../utils/getEnv";
import { errorFormat } from "../../utils/errorFormat";
import { createUser } from "../../services/createUser.service";
import { signAccessToken, signRefreshToken } from "../../utils/jwt";
import { setCookies } from "../../utils/setCookies";
import { storeToken } from "../../services/storeToken.service";

const registerController: RequestHandler = async (req, res, next) => {
  const { email } = req.body;
  const userAgent = req.headers["user-agent"];
  if (!userAgent) throw errorFormat("no user agent");

  const isUserExist = await userExist(email);

  if (isUserExist) throw errorFormat("user already exists", BAD_REQUEST);
  const newUser = await createUser(req.body);

  const token = signAccessToken({
    userId: newUser._id.toString(),
    role: newUser.role,
  });

  const refreshToken = signRefreshToken({
    userId: newUser._id.toString(),
    role: newUser.role,
    email: newUser.email,
  });

  const storedRefreshToken = await storeToken(
    newUser._id,
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

  const userReturned = newUser.deletePassword();

  res.status(CREATED).json({ user: userReturned, token: storedRefreshToken });
};

export default registerController;
