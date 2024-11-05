import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
});

export async function sendVerificationEmail(email: string, tempId: string) {
  const verificationLink = `${process.env.NEXT_PUBLIC_APP_URL}/verify?tempId=${tempId}`;

  await transporter.sendMail({
    from: process.env.SMTP_USER,
    to: email,
    subject: 'Verify your AnonSocial account',
    html: `
      <h1>Welcome to AnonSocial!</h1>
      <p>Your temporary ID is: <strong>${tempId}</strong></p>
      <p>Please keep this ID safe as you'll need it to log in.</p>
      <p>Click the link below to verify your email:</p>
      <a href="${verificationLink}">${verificationLink}</a>
    `,
  });
}

export async function sendRecoveryEmail(email: string, newTempId: string) {
  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <style>
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }
          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
            line-height: 1.6;
            background: #f5f5f5;
            color: #333;
          }
          .container {
            max-width: 600px;
            margin: 40px auto;
            background: #0A0F1C;
            border-radius: 16px;
            overflow: hidden;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          }
          .header {
            background: linear-gradient(135deg, #4D61FC, #FF4B91);
            padding: 40px 20px;
            text-align: center;
            color: white;
          }
          .logo {
            font-size: 36px;
            font-weight: bold;
            margin-bottom: 10px;
          }
          .content {
            padding: 40px 30px;
            color: #fff;
          }
          .welcome {
            font-size: 24px;
            font-weight: 600;
            margin-bottom: 20px;
            color: #fff;
          }
          .credentials-box {
            background: rgba(255, 255, 255, 0.05);
            border: 1px solid rgba(255, 255, 255, 0.1);
            border-radius: 12px;
            padding: 25px;
            margin: 25px 0;
          }
          .temp-id {
            font-family: 'Courier New', monospace;
            font-size: 32px;
            color: #FF4B91;
            background: rgba(255, 75, 145, 0.1);
            padding: 15px;
            border-radius: 8px;
            text-align: center;
            margin: 15px 0;
            letter-spacing: 2px;
          }
          .info-item {
            display: flex;
            align-items: center;
            gap: 10px;
            padding: 12px;
            background: rgba(255, 255, 255, 0.03);
            border-radius: 8px;
            margin: 10px 0;
          }
          .info-icon {
            font-size: 20px;
            min-width: 24px;
          }
          .info-text {
            font-size: 14px;
            color: #e0e0e0;
          }
          .button {
            display: inline-block;
            padding: 14px 30px;
            background: linear-gradient(135deg, #4D61FC, #FF4B91);
            color: white;
            text-decoration: none;
            border-radius: 8px;
            font-weight: 600;
            margin: 20px 0;
          }
          .footer {
            text-align: center;
            padding: 30px;
            background: rgba(255, 255, 255, 0.02);
            border-top: 1px solid rgba(255, 255, 255, 0.05);
            color: #888;
            font-size: 12px;
          }
          .divider {
            height: 1px;
            background: rgba(255, 255, 255, 0.1);
            margin: 20px 0;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <div class="logo">🔐 Account Recovery</div>
            <p>AnonSocial Security</p>
          </div>

          <div class="content">
            <h1 class="welcome">Account Recovery</h1>
            <p>We've generated a new Temporary ID for your account.</p>

            <div class="credentials-box">
              <strong style="color: #4D61FC;">New Temporary ID:</strong>
              <div class="temp-id">${newTempId}</div>
            </div>

            <div class="info-item">
              <span class="info-icon">⚠️</span>
              <span class="info-text">Your old Temporary ID has been deactivated</span>
            </div>

            <div style="text-align: center;">
              <a href="${process.env.NEXT_PUBLIC_APP_URL}/login" class="button">
                Login with New ID
              </a>
            </div>
          </div>

          <div class="footer">
            <p>This is an automated message, please do not reply.</p>
            <div class="divider"></div>
            <p>© 2024 AnonSocial. All rights reserved.</p>
            <p style="margin-top: 10px;">
              If you didn't request this recovery, please contact support immediately.
            </p>
          </div>
        </div>
      </body>
    </html>
  `;

  await transporter.sendMail({
    from: process.env.SMTP_USER,
    to: email,
    subject: '🔐 AnonSocial Account Recovery',
    html,
  });
}

export async function sendTempIdEmail(email: string, username: string, tempId: string) {
  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <style>
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }
          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            line-height: 1.6;
            color: #333;
            background: #f5f5f5;
          }
          .container {
            max-width: 600px;
            margin: 40px auto;
            background: #ffffff;
            border-radius: 16px;
            overflow: hidden;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          }
          .header {
            background: #4D61FC;
            padding: 40px;
            text-align: center;
            color: white;
          }
          .logo {
            font-size: 48px;
            margin-bottom: 20px;
          }
          .content {
            padding: 40px;
          }
          .welcome-box {
            text-align: center;
            margin-bottom: 30px;
          }
          .welcome-title {
            font-size: 24px;
            font-weight: bold;
            color: #4D61FC;
            margin-bottom: 10px;
          }
          .credentials-box {
            background: #f8faff;
            border: 2px solid #4D61FC;
            border-radius: 12px;
            padding: 25px;
            margin: 25px 0;
            text-align: center;
          }
          .temp-id {
            font-family: monospace;
            font-size: 32px;
            color: #4D61FC;
            background: #eef2ff;
            padding: 15px;
            border-radius: 8px;
            margin: 15px 0;
            letter-spacing: 2px;
          }
          .info-box {
            background: #f8faff;
            border-radius: 12px;
            padding: 20px;
            margin: 30px 0;
          }
          .info-item {
            display: flex;
            align-items: center;
            gap: 15px;
            padding: 12px;
            background: white;
            border-radius: 8px;
            margin: 10px 0;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
          }
          .info-icon {
            font-size: 24px;
          }
          .button {
            display: inline-block;
            padding: 15px 30px;
            background: #4D61FC;
            color: white;
            text-decoration: none;
            border-radius: 8px;
            font-weight: 600;
            margin: 20px 0;
          }
          .footer {
            text-align: center;
            padding: 30px;
            background: #f8faff;
            color: #666;
            font-size: 12px;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <div class="logo">🎭</div>
            <h1>Welcome to AnonSocial</h1>
          </div>

          <div class="content">
            <div class="welcome-box">
              <h2 class="welcome-title">Hey ${username}!</h2>
              <p>Your anonymous journey begins here</p>
            </div>

            <div class="credentials-box">
              <h3>Your Login Credentials</h3>
              <p><strong>Username:</strong> ${username}</p>
              <div class="temp-id">${tempId}</div>
              <p style="color: #666;">Keep this Temporary ID safe</p>
            </div>

            <div class="info-box">
              <div class="info-item">
                <span class="info-icon">🔐</span>
                <span>Use your username and Temporary ID to log in</span>
              </div>
              <div class="info-item">
                <span class="info-icon">🤫</span>
                <span>Never share your Temporary ID with anyone</span>
              </div>
              <div class="info-item">
                <span class="info-icon">📱</span>
                <span>Access your account from any device</span>
              </div>
            </div>

            <div style="text-align: center;">
              <a href="${process.env.NEXT_PUBLIC_APP_URL}/login" class="button">
                Login to Your Account
              </a>
            </div>
          </div>

          <div class="footer">
            <p>If you didn't create this account, please ignore this email.</p>
            <p style="margin-top: 10px;">© 2024 AnonSocial. All rights reserved.</p>
          </div>
        </div>
      </body>
    </html>
  `;

  await transporter.sendMail({
    from: process.env.SMTP_USER,
    to: email,
    subject: '🎭 Welcome to AnonSocial - Your Login Credentials',
    html,
  });
} 