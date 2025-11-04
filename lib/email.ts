import { email as emailConfig } from '@/lib/config';

export interface EmailOptions {
  to: string;
  subject: string;
  text?: string;
  html?: string;
}

/**
 * Check if email service is configured and enabled
 */
export function isEmailEnabled(): boolean {
  return emailConfig.enabled;
}

/**
 * Send email using configured SMTP server
 * Only works if email service is enabled
 */
export async function sendEmail(options: EmailOptions): Promise<boolean> {
  if (!emailConfig.enabled) {
    console.log('Email service not configured, skipping email send');
    return false;
  }

  try {
    // Using nodemailer would require adding it as a dependency
    // For now, this is a placeholder that logs the email
    console.log('📧 Email (would be sent):', {
      from: `${emailConfig.fromName} <${emailConfig.fromEmail}>`,
      to: options.to,
      subject: options.subject,
      smtp: {
        host: emailConfig.host,
        port: emailConfig.port,
        secure: emailConfig.secure,
        user: emailConfig.user,
      },
    });

    // TODO: Implement actual email sending with nodemailer
    // const nodemailer = require('nodemailer');
    // const transporter = nodemailer.createTransport({
    //   host: emailConfig.host,
    //   port: emailConfig.port,
    //   secure: emailConfig.secure,
    //   auth: {
    //     user: emailConfig.user,
    //     pass: emailConfig.password,
    //   },
    // });
    //
    // await transporter.sendMail({
    //   from: `${emailConfig.fromName} <${emailConfig.fromEmail}>`,
    //   to: options.to,
    //   subject: options.subject,
    //   text: options.text,
    //   html: options.html,
    // });

    return true;
  } catch (error) {
    console.error('Failed to send email:', error);
    return false;
  }
}

/**
 * Send server status alert email
 */
export async function sendServerStatusAlert(
  serverHost: string,
  serverPort: number,
  online: boolean,
  recipientEmail: string
): Promise<boolean> {
  const subject = online
    ? `✅ Server Online: ${serverHost}:${serverPort}`
    : `❌ Server Offline: ${serverHost}:${serverPort}`;

  const text = online
    ? `The Minecraft server ${serverHost}:${serverPort} is now online.`
    : `The Minecraft server ${serverHost}:${serverPort} appears to be offline or unreachable.`;

  const html = `
    <h2>${online ? '✅ Server Online' : '❌ Server Offline'}</h2>
    <p>Server: <strong>${serverHost}:${serverPort}</strong></p>
    <p>Status: <strong>${online ? 'Online' : 'Offline'}</strong></p>
    <p>Check it now at: <a href="https://yourdomain.com">Minecraft Server Status</a></p>
  `;

  return sendEmail({
    to: recipientEmail,
    subject,
    text,
    html,
  });
}

/**
 * Send welcome email to new users
 */
export async function sendWelcomeEmail(
  userEmail: string,
  userName?: string
): Promise<boolean> {
  const greeting = userName ? `Hi ${userName}` : 'Hi there';
  
  const subject = 'Welcome to Minecraft Server Status!';
  const text = `${greeting},\n\nWelcome to Minecraft Server Status! You can now save your favorite servers and get notifications when they go online or offline.\n\nGet started: https://yourdomain.com`;
  const html = `
    <h2>Welcome to Minecraft Server Status!</h2>
    <p>${greeting},</p>
    <p>Thanks for signing up! You can now:</p>
    <ul>
      <li>Save your favorite Minecraft servers</li>
      <li>Get real-time status updates</li>
      <li>Monitor server uptime</li>
    </ul>
    <p><a href="https://yourdomain.com">Get started now</a></p>
  `;

  return sendEmail({
    to: userEmail,
    subject,
    text,
    html,
  });
}
