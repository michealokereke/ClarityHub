import { RequestHandler } from "express";
import { clearCookie } from "../../utils/setCookies";
import { verifyRefreshToken } from "../../utils/jwt";
import { findRefreshFamilyToken } from "../../services/tokenFamily.service";

const logoutController: RequestHandler = async (req, res, next) => {
  try {
    const reqRefreshToken = req.cookies.ch_refresh;
    const verifiedReqRefreshToken = verifyRefreshToken(reqRefreshToken);

    if (
      verifiedReqRefreshToken &&
      typeof verifiedReqRefreshToken !== "string"
    ) {
      const refreshTokenFamily = await findRefreshFamilyToken({
        userId: verifiedReqRefreshToken.userId,
        familyId: verifiedReqRefreshToken.familyId,
      });
      if (refreshTokenFamily) {
        refreshTokenFamily.revokedAt = new Date();
        await refreshTokenFamily.save();
      }
    }
  } catch (error) {}

  clearCookie(res, "ch_refresh");
  clearCookie(res, "ch_access");

  res.json({ message: "user logout successfully" });
};

export default logoutController;
