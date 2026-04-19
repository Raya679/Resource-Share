// backend/sendEmail.js
const nodemailer = require("nodemailer");

const createTransporter = () => {
  return nodemailer.createTransport({
    service: process.env.EMAIL_SERVICE || "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
};

const sendEmail = async (to, subject, html) => {
  try {
    if (process.env.EMAIL_ENABLED && process.env.EMAIL_ENABLED !== "true") {
      console.log("Email sending skipped because EMAIL_ENABLED != 'true'");
      return;
    }

    const transporter = createTransporter();
    const info = await transporter.sendMail({
      from: `"Resource Share" <${process.env.EMAIL_USER}>`,
      to: to,
      subject: subject,
      html: html,
    });

    console.log("Email sent:", info.messageId, "to", to);
    return info;
  } catch (err) {
    console.error("Error sending email to", to, err);
    throw err;
  }
};

module.exports = sendEmail;