"use server";

import nodemailer from "nodemailer"

const transporter = nodemailer.createTransport({
  host: "smtp.zoho.eu",
  port: 587,
  auth: {
    user: process.env.EMAIL_FROM,
    pass: process.env.EMAIL_PASSWORD,
  },
});

export async function sendMail(mailData: MailData) {
  await transporter.sendMail({
    from: process.env.EMAIL_FROM,
    to: mailData.email,
    subject: mailData.subject,
    html: mailData.html
  });
}

export interface MailData {
  email: string,
  subject: string,
  html: string
}