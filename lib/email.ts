'use server';

import { IS_DEV } from '@/lib/constants';
import nodemailer from 'nodemailer';
import * as postmark from 'postmark';

const postmarkClient = new postmark.ServerClient(process.env.POSTMARK_API_KEY!);

type EmailParams = {
  to: string;
  subject: string;
  content: string;
  from?: string;
};

export async function sendEmail({ to, from, subject, content }: EmailParams) {
  try {
    const fromEmail = from ?? process.env.FROM_EMAIL!;

    // Avoid wasting email credits in development
    if (IS_DEV) {
      const smtpTransporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST!,
        port: Number(process.env.SMTP_PORT),
        secure: process.env.SMTP_SECURE === 'true',
        auth: {
          user: process.env.SMTP_USER!,
          pass: process.env.SMTP_PASS!,
        },
      });

      const result = await smtpTransporter.sendMail({
        from: fromEmail,
        to,
        subject,
        html: content,
      });
      return result;
    }

    const result = await postmarkClient.sendEmail({
      From: fromEmail,
      To: to,
      Subject: subject,
      HtmlBody: content,
    });
    return result;
  } catch (error) {
    console.error('Unable to send email');
    throw error;
  }
}
