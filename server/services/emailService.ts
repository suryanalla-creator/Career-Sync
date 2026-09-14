import nodemailer from 'nodemailer';
import { db } from '../db';

interface SendCredentialsOptions {
  to: string;
  name: string;
  role: 'institution' | 'industry';
  organization: string;
  tempPassword: string;
  loginUrl?: string;
}

interface SendRejectionOptions {
  to: string;
  name: string;
  role: 'institution' | 'industry';
  organization: string;
  reason: string;
}

let transporterInstance: nodemailer.Transporter | null = null;

async function getTransporter(): Promise<nodemailer.Transporter> {
  if (transporterInstance) return transporterInstance;

  const smtpHost = process.env.SMTP_HOST;
  const smtpPort = parseInt(process.env.SMTP_PORT || '587');
  const smtpUser = process.env.SMTP_USER;
  const smtpPass = process.env.SMTP_PASS;

  if (smtpHost && smtpUser && smtpPass) {
    console.log(`📧 Initializing custom SMTP email transport (${smtpHost}:${smtpPort})...`);
    transporterInstance = nodemailer.createTransport({
      host: smtpHost,
      port: smtpPort,
      secure: smtpPort === 465,
      auth: {
        user: smtpUser,
        pass: smtpPass
      }
    });
  } else {
    // Generate or use Ethereal mock/live sandbox transport
    try {
      console.log('📧 Setting up test mail transport (Ethereal / local dispatch)...');
      const testAccount = await nodemailer.createTestAccount();
      transporterInstance = nodemailer.createTransport({
        host: 'smtp.ethereal.email',
        port: 587,
        secure: false,
        auth: {
          user: testAccount.user,
          pass: testAccount.pass
        }
      });
      console.log(`📬 Mail transport active. Ethereal inbox: ${testAccount.user}`);
    } catch (err) {
      console.warn('⚠️ Could not connect to Ethereal, falling back to json transport:', err);
      transporterInstance = nodemailer.createTransport({
        jsonTransport: true
      });
    }
  }

  return transporterInstance;
}

export const emailService = {
  /**
   * Send verified account credentials email to newly approved institution or industry
   */
  async sendAccountCredentials(opts: SendCredentialsOptions): Promise<{ success: boolean; previewUrl?: string | false; error?: string }> {
    const { to, name, role, organization, tempPassword } = opts;
    const fromAddress = process.env.SMTP_FROM || '"CAREER SYNC Central Admin" <admin@careersync.com>';
    const roleTitle = role === 'institution' ? 'Educational Institution' : 'Corporate Industry Partner';
    const loginUrl = opts.loginUrl || 'http://localhost:5173/#/login';

    const subject = `🎉 Verified Account Credentials: ${organization} on CAREER SYNC`;

    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8" />
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f8fafc; margin: 0; padding: 20px; color: #1e293b; }
          .container { max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 16px; overflow: hidden; border: 1px solid #e2e8f0; box-shadow: 0 4px 12px rgba(0,0,0,0.05); }
          .header { background: linear-gradient(135deg, #1e3a8a, #3b82f6); padding: 32px 24px; text-align: center; color: #ffffff; }
          .header h1 { margin: 0; font-size: 24px; font-weight: 800; letter-spacing: -0.5px; }
          .header p { margin: 8px 0 0 0; opacity: 0.9; font-size: 13px; font-weight: 500; }
          .body { padding: 32px 24px; }
          .badge { display: inline-block; padding: 4px 12px; border-radius: 9999px; font-size: 11px; font-weight: 700; background-color: #ecfdf5; color: #047857; border: 1px solid #a7f3d0; margin-bottom: 16px; }
          .cred-box { background-color: #f1f5f9; border: 1px solid #cbd5e1; border-radius: 12px; padding: 20px; margin: 24px 0; }
          .cred-row { display: flex; justify-content: space-between; margin-bottom: 10px; font-size: 14px; }
          .cred-label { color: #64748b; font-weight: 600; }
          .cred-value { font-family: monospace; font-size: 15px; font-weight: 700; color: #0f172a; background: #ffffff; padding: 2px 8px; border-radius: 6px; border: 1px solid #e2e8f0; }
          .alert-box { background-color: #fffbeb; border-left: 4px solid #f59e0b; padding: 14px; border-radius: 6px; font-size: 13px; color: #92400e; margin: 20px 0; }
          .btn { display: block; text-align: center; background-color: #2563eb; color: #ffffff !important; text-decoration: none; padding: 14px 24px; border-radius: 10px; font-weight: 700; font-size: 15px; margin: 28px 0; }
          .footer { background-color: #f8fafc; border-top: 1px solid #e2e8f0; padding: 20px 24px; text-align: center; font-size: 12px; color: #94a3b8; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>CAREER SYNC</h1>
            <p>Institutional & Corporate Accreditation Authority</p>
          </div>
          <div class="body">
            <span class="badge">✓ Government & Institutional Certificate Verified</span>
            <h2 style="margin-top: 0; color: #0f172a; font-size: 20px;">Welcome, ${name}!</h2>
            <p style="font-size: 14px; line-height: 1.6; color: #334155;">
              We are pleased to inform you that the official accreditation certificates and credentials submitted for <strong>${organization}</strong> have been thoroughly examined and verified by the CAREER SYNC Central Administration.
            </p>
            <p style="font-size: 14px; line-height: 1.6; color: #334155;">
              Your <strong>${roleTitle}</strong> account is now officially authorized and active. Below are your default system login credentials:
            </p>

            <div class="cred-box">
              <div class="cred-row">
                <span class="cred-label">Authorized Login ID:</span>
                <span class="cred-value">${to}</span>
              </div>
              <div class="cred-row">
                <span class="cred-label">Default Access Password:</span>
                <span class="cred-value">${tempPassword}</span>
              </div>
              <div class="cred-row">
                <span class="cred-label">Registered Organization:</span>
                <span class="cred-value">${organization}</span>
              </div>
            </div>

            <div class="alert-box">
              <strong>Mandatory Security Action:</strong> For data confidentiality and compliance with national digital safety guidelines, you must change this temporary default password upon your very first login.
            </div>

            <a href="${loginUrl}" class="btn">Log In to CAREER SYNC Portal</a>

            <p style="font-size: 13px; color: #64748b; line-height: 1.5;">
              If you have any operational inquiries or require multi-campus delegation, please reach out directly to the verification board at <a href="mailto:admin@careersync.com" style="color: #2563eb;">admin@careersync.com</a>.
            </p>
          </div>
          <div class="footer">
            © 2026 CAREER SYNC Ecosystem. All rights reserved.<br />
            Confidential accreditation notice dispatched to ${to}.
          </div>
        </div>
      </body>
      </html>
    `;

    try {
      const transporter = await getTransporter();
      const info = await transporter.sendMail({
        from: fromAddress,
        to,
        subject,
        html
      });

      const previewUrl = nodemailer.getTestMessageUrl(info);
      console.log(`✅ Real email dispatched to ${to}! Message ID: ${info.messageId}`);
      if (previewUrl) {
        console.log(`🔗 Ethereal Email Preview URL: ${previewUrl}`);
      }

      // Record to dispatched_emails audit table
      try {
        db.prepare(`
          INSERT INTO dispatched_emails (id, recipient_email, recipient_name, subject, body_html, temp_password, status, sent_at)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `).run(
          `email-${Date.now()}`,
          to,
          name,
          subject,
          html,
          tempPassword,
          'Sent',
          new Date().toISOString()
        );
      } catch (dbErr) {
        console.error('Failed to log dispatched email in db:', dbErr);
      }

      return { success: true, previewUrl: previewUrl || false };
    } catch (err: any) {
      console.error('❌ Failed to dispatch email via nodemailer:', err);
      // Log failure in db
      try {
        db.prepare(`
          INSERT INTO dispatched_emails (id, recipient_email, recipient_name, subject, body_html, temp_password, status, sent_at, error_message)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        `).run(
          `email-${Date.now()}`,
          to,
          name,
          subject,
          html,
          tempPassword,
          'Failed',
          new Date().toISOString(),
          err.message || String(err)
        );
      } catch {}

      return { success: false, error: err.message };
    }
  },

  /**
   * Send rejection notice if certificates failed verification
   */
  async sendRejectionNotice(opts: SendRejectionOptions): Promise<{ success: boolean; previewUrl?: string | false; error?: string }> {
    const { to, name, role, organization, reason } = opts;
    const fromAddress = process.env.SMTP_FROM || '"CAREER SYNC Central Admin" <admin@careersync.com>';
    const subject = `Update Regarding Your Account Verification: ${organization}`;

    const html = `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; border: 1px solid #e2e8f0; border-radius: 12px; background: #fff;">
        <h2 style="color: #b91c1c;">CAREER SYNC Verification Update</h2>
        <p>Dear ${name},</p>
        <p>Thank you for submitting your registration for <strong>${organization}</strong> on CAREER SYNC.</p>
        <p>Our Central Verification Board has reviewed the submitted documentation and could not verify the credentials due to the following reason:</p>
        <div style="background: #fef2f2; border: 1px solid #fecaca; padding: 14px; border-radius: 8px; color: #991b1b; margin: 16px 0;">
          <strong>Audit Notes:</strong> ${reason}
        </div>
        <p>You may submit an updated verification request with valid government or institutional certificates at any time.</p>
        <p>Best regards,<br />CAREER SYNC Verification Administration</p>
      </div>
    `;

    try {
      const transporter = await getTransporter();
      const info = await transporter.sendMail({
        from: fromAddress,
        to,
        subject,
        html
      });
      const previewUrl = nodemailer.getTestMessageUrl(info);

      try {
        db.prepare(`
          INSERT INTO dispatched_emails (id, recipient_email, recipient_name, subject, body_html, status, sent_at)
          VALUES (?, ?, ?, ?, ?, ?, ?)
        `).run(
          `email-${Date.now()}`,
          to,
          name,
          subject,
          html,
          'Sent (Rejection Notice)',
          new Date().toISOString()
        );
      } catch {}

      return { success: true, previewUrl: previewUrl || false };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  }
};
