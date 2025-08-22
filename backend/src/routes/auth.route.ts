import { Router } from "express";
import registerController from "../controllers/auth/register.controller";
import loginController from "../controllers/auth/login.controller";
import logoutController from "../controllers/auth/logout.controller";
import schemaValidator from "../middleware/schemaValidator";
import { registerSchema } from "../validators/register.validator";
import { loginSchema } from "../validators/login.schema";
import refreshTokenController from "../controllers/auth/refreshToken.controller";
import { reqRateLimitPerMinute } from "../utils/reqRateLimit";
import { adminInviteSchema } from "../validators/adminInvite.schema";
import generalErrorCather from "../utils/generalErrorCatcher";
import adminInviteController from "../controllers/auth/adminInvite.controller";

const registerRateLimit = reqRateLimitPerMinute(10);
const authRouter = Router();

authRouter.use("/register", registerRateLimit);
authRouter.post(
  "/register",
  schemaValidator(registerSchema),
  generalErrorCather(registerController)
);

authRouter.post(
  "/login",
  schemaValidator(loginSchema),
  generalErrorCather(loginController)
);

authRouter.post("/logout", generalErrorCather(logoutController));

authRouter.post("/refresh-token", generalErrorCather(refreshTokenController));

authRouter.post(
  "/invite",
  schemaValidator(adminInviteSchema),
  generalErrorCather(adminInviteController)
);
// authRouter.post("/accept-invite", inviteToken)
// authRouter.post("/password/forget", inviteToken)
// authRouter.post("/password/reset", inviteToken)

export default authRouter;
