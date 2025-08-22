import { RequestHandler } from "express";
import {
  userExist,
  createUser,
  userDocTypes,
  userStatus,
} from "../../services/userModel.service";
import { BAD_REQUEST, CREATED } from "../../utils/getEnv";
import { errorFormat } from "../../utils/errorFormat";
import { signAccessToken, signRefreshToken } from "../../utils/jwt";
import { setCookies } from "../../utils/setCookies";
import { storeToken } from "../../services/storeToken.service";
import { createWorkSpace } from "../../services/tenantModel.service";
import {
  createRefreshTokenFamily,
  refreshTokenFamilyType,
} from "../../services/tokenFamily.service";
import { sha256 } from "../../utils/sha256";
import { getuuidv4 } from "../../utils/uuidv4";

const registerController: RequestHandler = async (req, res, next) => {
  const { email, workspaceName, password, name } = req.body;

  let spaceName = workspaceName;

  const isUserExist = await userExist(email);
  if (isUserExist) throw errorFormat("user already exists", BAD_REQUEST);

  if (!workspaceName) {
    spaceName = `${name} Workspace`;
  }

  const TenantWorkspace = await createWorkSpace(spaceName);

  const tenantId = TenantWorkspace._id;

  const userDocs: userDocTypes = {
    email,
    password,
    profile: { name },
    tenantId,
    status: userStatus.ACTIVE,
  };

  const newUser = await createUser(userDocs);

  const tokenFamilyDocs: refreshTokenFamilyType = {
    tenantId,
    userId: newUser._id,
    familyId: getuuidv4(),
    currentTokenId: getuuidv4(),
  };

  const refreshTokenFamily = await createRefreshTokenFamily(tokenFamilyDocs);
  const token = signAccessToken({
    userId: newUser._id.toString(),
    tenantId: tenantId.toString(),
    role: newUser.role,
  });

  const refreshToken = signRefreshToken({
    jti: tokenFamilyDocs.currentTokenId,
    familyId: tokenFamilyDocs.familyId,
    userId: tokenFamilyDocs.userId,
  });

  setCookies(res, "ch_access", token, 15 * 60 * 1000);
  setCookies(res, "ch_refresh", refreshToken, 24 * 60 * 60 * 1000);

  const userReturned = newUser.deletePassword();

  res.status(CREATED).json({ user: userReturned });
};

export default registerController;
