/**
 * Outgoing email. Works with either:
 *  - RESEND_API_KEY (https://resend.com, HTTP API), or
 *  - SMTP_HOST / SMTP_PORT / SMTP_USER / SMTP_PASS (any provider, e.g. a Gmail app password).
 * MAIL_FROM sets the sender ("Mrovdostan <no-reply@yourdomain.org>").
 * When neither is configured, isEmailConfigured() is false and callers skip sending.
 */
const FROM = process.env.MAIL_FROM || 'Mrovdostan <no-reply@localhost>';

const isEmailConfigured = () => !!(process.env.RESEND_API_KEY || (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS));

async function sendViaResend({ to, subject, html, text }) {
  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: `Bearer ${process.env.RESEND_API_KEY}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ from: FROM, to: [to], subject, html, text }),
  });
  if (!res.ok) throw new Error(`Resend responded ${res.status}: ${await res.text()}`);
}

async function sendViaSmtp({ to, subject, html, text }) {
  const nodemailer = require('nodemailer');
  const port = Number(process.env.SMTP_PORT) || 587;
  const transport = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port,
    secure: port === 465,
    auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
  });
  await transport.sendMail({ from: FROM, to, subject, html, text });
}

async function sendMail(message) {
  if (process.env.RESEND_API_KEY) return sendViaResend(message);
  if (process.env.SMTP_HOST) return sendViaSmtp(message);
  throw new Error('Email is not configured');
}

module.exports = { sendMail, isEmailConfigured };
