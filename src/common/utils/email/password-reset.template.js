export const passwordResetTemplate = (resetLink) => `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Reset Your SarahaClone Password</title>
</head>
<body style="margin:0;padding:0;background-color:#0f0f0f;font-family:'Georgia',serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#0f0f0f;padding:48px 16px;">
    <tr>
      <td align="center">
        <table width="480" cellpadding="0" cellspacing="0" style="background-color:#1a1a1a;border-radius:12px;overflow:hidden;border:1px solid #2a2a2a;">

          <!-- Header -->
          <tr>
            <td style="padding:40px 48px 32px;border-bottom:1px solid #2a2a2a;">
              <p style="margin:0;font-size:26px;font-weight:700;color:#f5f0e8;letter-spacing:3px;text-transform:uppercase;">SarahaClone</p>
              <p style="margin:6px 0 0;font-size:12px;color:#666;letter-spacing:1px;text-transform:uppercase;">Anonymous Messaging</p>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:40px 48px;">
              <p style="margin:0 0 8px;font-size:13px;color:#888;letter-spacing:1px;text-transform:uppercase;">Password Reset</p>
              <p style="margin:0 0 32px;font-size:16px;color:#ccc;line-height:1.6;">
                We received a request to reset your password. Click the button below to proceed. This link expires in <span style="color:#f5f0e8;">15 minutes</span>.
              </p>

              <!-- CTA Button -->
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td align="center">
                    <a href="${resetLink}" style="display:inline-block;padding:14px 36px;background-color:#f5f0e8;color:#0f0f0f;font-size:14px;font-weight:700;letter-spacing:2px;text-transform:uppercase;text-decoration:none;border-radius:6px;">Reset Password</a>
                  </td>
                </tr>
              </table>

              <!-- Fallback link -->
              <p style="margin:28px 0 0;font-size:12px;color:#555;line-height:1.8;">
                If the button doesn't work, copy and paste this link into your browser:<br/>
                <a href="${resetLink}" style="color:#888;word-break:break-all;">${resetLink}</a>
              </p>

              <p style="margin:24px 0 0;font-size:13px;color:#555;line-height:1.6;">
                If you didn't request a password reset, you can safely ignore this email.
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding:24px 48px;border-top:1px solid #2a2a2a;">
              <p style="margin:0;font-size:12px;color:#444;">© ${new Date().getFullYear()} SarahaClone. All rights reserved.</p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`;
