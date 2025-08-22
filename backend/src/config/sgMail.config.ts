import sendgrid from "@sendgrid/mail";
import { SENDGRID_API_KEY } from "../utils/getEnv";

export const sgMail = sendgrid.setApiKey(SENDGRID_API_KEY);
