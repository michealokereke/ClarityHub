import { Router } from "express";
import registerController from "../controllers/auth/register.controller";
import loginController from "../controllers/auth/login.controller";
import logoutController from "../controllers/auth/logout.controller";
import schemaValidator from "../middleware/schemaValidator";
import { registerSchema } from "../validators/register.validator";
import { loginSchema } from "../validators/login.schema";
import refreshValidator from "../middleware/refreshValidator.middleware";
import refreshTokenController from "../controllers/auth/refreshToken.controller";
import generalErrorCather from "../utils/generalErrorCatcher";

const authRouter = Router();

authRouter.post(
  "/register",
  schemaValidator(registerSchema),
  registerController
);
authRouter.post("/login", schemaValidator(loginSchema), loginController);
authRouter.post("/logout", refreshValidator, logoutController);
authRouter.post("/refresh-token", refreshValidator, refreshTokenController);
// authRouter.post("/invite-token", inviteToken)
// authRouter.post("/accept-token", acceptToken)

export default authRouter;
