import nodemailer from 'nodemailer';
import cron from 'node-cron';
import { EMAIL_USER, EMAIL_PASS } from '../config/env.js';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: EMAIL_USER,
    pass: EMAIL_PASS,
  },
});

export default async function sendEmail(to, subject, text) {
  try {
    console.log(`Attempting to send email to: ${to}`);
    await transporter.sendMail({
      from: EMAIL_USER,
      to,
      subject,
      text,
    });
    console.log('Email sent successfully!');
  } catch (error) {
    console.error('Failed to send email:', error);
  }
}

export  function scheduleEmail(schedule, to, subject, text) {
  if (!cron.validate(schedule)) {
    console.error('Invalid cron schedule: "' + schedule + '". Email not scheduled.');
    return;
  }
  cron.schedule(schedule, () => {
    console.log(`Executing scheduled email for "${to}" on schedule "${schedule}"`);
    sendEmail(to, subject, text);
  }, {
    scheduled: true,
    timezone: "Asia/Kolkata"
  });
  console.log(`Email to "${to}" has been scheduled with schedule: "${schedule}"`);
}