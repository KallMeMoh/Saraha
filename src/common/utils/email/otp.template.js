export const otpTemplate = (otp, reason = 'verify your identity') => `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Your SarahaClone OTP</title>
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
              <p style="margin:0 0 8px;font-size:13px;color:#888;letter-spacing:1px;text-transform:uppercase;">One-Time Code</p>
              <p style="margin:0 0 32px;font-size:16px;color:#ccc;line-height:1.6;">
                Use the code below to ${reason}. It expires in <span style="color:#f5f0e8;">5 minutes</span>.
              </p>

              <!-- OTP Box -->
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td align="center" style="background-color:#111;border:1px solid #333;border-radius:8px;padding:28px;">
                    <p style="margin:0;font-size:42px;font-weight:700;letter-spacing:16px;color:#f5f0e8;font-family:'Courier New',monospace;">${otp}</p>
                  </td>
                </tr>
              </table>

              <p style="margin:32px 0 0;font-size:13px;color:#555;line-height:1.6;">
                If you didn't request this code, you can safely ignore this email.
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
