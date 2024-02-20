import nodemailer from "nodemailer";
import { MAIL_USER, MAIL_PASS } from "../config/config.js";

export default class Mail {
  constructor() {
    this.transport = nodemailer.createTransport({
      service: "gmail",
      port: 587,
      auth: {
        user: MAIL_USER,
        pass: MAIL_PASS,
      },
    });
  }

  send = async (userEmail, subject, html) => {
    const options = {
      from: MAIL_USER,
      to: userEmail,
      subject,
      html
    }

    const result = await this.transport.sendMail(options)

    return result
  }
}
