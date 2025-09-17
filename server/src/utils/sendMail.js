import nodeMailer from "nodemailer";
import { ApiError } from "./ApiError.js";
import logger from "./logger.js";

const sendMail = async ({ to, subject, html }) => {
  try {
    const transporter = nodeMailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER, // admin email for sending mail to user
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to,
      subject,
      html,
    });
    logger.info("Email sent successfully");
  } catch (error) {
    logger.error("Failed to send email", { error: error.message });
    throw new ApiError(error);
  }
};

export { sendMail };
