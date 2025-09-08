import nodemailer from "nodemailer";
import config from "../config/env.js";
const transporter = nodemailer.createTransport({
  service: config.email.service,
  auth: {
    user: config.email.user,
    pass: config.email.pass,
  },
});

/**
 * Send email
 * @param {Object} options
 * @param {string} options.to - Recipient email
 * @param {string} options.subject - Email subject
 * @param {string} options.text - Plain text body
 * @param {string} [options.html] - Optional HTML body
 */
export async function sendEmail({ to, subject, text, html }) {
  if (!config.email.user || !config.email.pass) {
    throw new Error("Email credentials not configured in config/env.js");
  }

  const mailOptions = {
    from: config.email.user,
    to,
    subject,
    text,
    html: html || undefined,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log(`📧 Email sent: ${info.messageId}`);
    return info;
  } catch (err) {
    console.error("❌ Failed to send email:", err.message);
    throw err;
  }
}

/**
 * Format tasks into a plain text email
 * @param {Array} tasks - Array of task objects
 * @param {string} header - Header for the email
 * @returns {string} Formatted task list
 */
export function formatTasksText(tasks, header = "Tasks") {
  if (!tasks || tasks.length === 0) {
    return `${header}:\nNo tasks found 🎉`;
  }

  const lines = tasks.map((t, i) => {
    const deadline = t.dueDate
      ? new Date(t.dueDate).toLocaleString()
      : "No deadline";
    return `${i + 1}. ${t.title} (Due: ${deadline}) [${t.completed ? "✅ Done" : "⏳ Pending"}]`;
  });

  return `${header}:\n\n${lines.join("\n")}`;
}