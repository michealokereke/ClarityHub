import { RequestHandler, Request, Response, NextFunction } from "express";
import { errorFormat } from "../utils/errorFormat";
import { BAD_REQUEST } from "../utils/getEnv";
import { sha256 } from "../utils/sha256";
import { findDBRefreshTokenDoc } from "../services/userExists.service";
import { refreshTokenTypes } from "../Models/refreshToken.model";

export interface refreshTokenReq extends Request {
  refreshTokenDoc?: refreshTokenTypes;
}

const refreshValidator = async (
  req: refreshTokenReq,
  res: Response,
  next: NextFunction
) => {
  const reqRefrshTokenToken = req.cookies.ch_refresh;
  if (!reqRefrshTokenToken)
    throw errorFormat("refresh token not seen ", BAD_REQUEST);

  const reqRefrshTokenTokenHash = sha256(reqRefrshTokenToken);

  const DBRefreshDoc = await findDBRefreshTokenDoc(reqRefrshTokenTokenHash);

  if (!DBRefreshDoc) throw errorFormat("invalid token", BAD_REQUEST);

  req.refreshTokenDoc = DBRefreshDoc;
  next();
};

export default refreshValidator;
