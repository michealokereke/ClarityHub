import { RequestHandler } from "express";
import { findOne } from "../../services/userModel.service";
import { authExtractorType } from "../../middleware/authExtractor.middleware";
import { errorFormat } from "../../utils/errorFormat";
import { SENDGRID_EMAIL, UNAUTHORIZED } from "../../utils/getEnv";
import { generateRandomCryptoToken } from "../../utils/cryptoRandom";
import { createInviteToken } from "../../services/initeToken.service";
import { sendLinkMail } from "../../utils/sendMail";

const adminInviteController: RequestHandler = async (
  req: authExtractorType,
  res,
  next
) => {
  const { email, role } = req.body;
  const user = req.user;
  if (!user) throw errorFormat("UNAUTHORIZED", UNAUTHORIZED);
  const { tenantId, userId } = user;

  const token = generateRandomCryptoToken();
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
  const inviteToken = await createInviteToken({
    token,
    email,
    tenantId,
    createdBy: userId,
    role,
    expiresAt,
  });

  sendLinkMail({
    to: email,
    from: SENDGRID_EMAIL,
    subject: "Admin Invite Link",
    text: `http://localhost:4000/accept-invite/${token}`,
    textValue: "click to accept",
  });

  res.json({ message: "ivite sent susccesfully" });
};

export default adminInviteController;
