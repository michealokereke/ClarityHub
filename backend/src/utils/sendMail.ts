import sendgrid from "@sendgrid/mail";
import { SENDGRID_API_KEY } from "../utils/getEnv";

sendgrid.setApiKey(SENDGRID_API_KEY);

export const sendLinkMail = async (msg: {
  to: string;
  from: string;
  subject: string;
  text: string;
  textValue: string;
}) => {
  try {
    const email = {
      to: msg.to,
      from: msg.from,
      subject: msg.subject,
      text: `Please click the link: ${msg.text}`,
      html: `<p>Please click the link: <a href=${msg.text}>${msg.textValue}</a></p>`,
    };

    await sendgrid.send(email);
    console.log(`Email sent to ${msg.to}`);
  } catch (error: any) {
    console.error("Error sending email:", error.message);
    console.error(error.stack);
  }
};
