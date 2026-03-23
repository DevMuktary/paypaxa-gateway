// @ts-ignore - ZeptoMail does not provide official TypeScript types
import { SendMailClient } from "zeptomail";

// --- CONFIGURATION ---
const SENDER_EMAIL = "hello@paypaxa.com"; // Ensure this is verified in ZeptoMail
const SENDER_NAME = "PAYPAXA Security";
const BOUNCE_EMAIL = "bounce@bounce-zem.paypaxa.com"; // Ensure this is verified in ZeptoMail

// --- BULLETPROOF EMAIL TEMPLATE (Anti-Spam Optimized) ---
const wrapEmail = (content: string) => `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>PAYPAXA Notification</title>
</head>
<body style="margin: 0; padding: 0; background-color: #F8FAFC; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; -webkit-font-smoothing: antialiased;">
  
  <table border="0" cellpadding="0" cellspacing="0" width="100%" style="table-layout: fixed; background-color: #F8FAFC; padding: 40px 20px;">
    <tr>
      <td align="center">
        
        <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px; background-color: #FFFFFF; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 10px rgba(0, 0, 0, 0.05); border: 1px solid #E2E8F0;">
          
          <tr>
            <td align="center" style="background-color: #060B19; padding: 35px 20px;">
              <span style="color: #FFFFFF; font-size: 26px; font-weight: 800; letter-spacing: 1.5px; margin: 0;">PAYPAXA</span>
            </td>
          </tr>

          <tr>
            <td style="padding: 40px 40px 10px 40px; color: #334155; font-size: 16px; line-height: 1.6;">
              ${content}
            </td>
          </tr>

          <tr>
            <td style="padding: 20px 40px 35px 40px;">
              <table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #EFF6FF; border-left: 4px solid #3B82F6; border-radius: 4px;">
                <tr>
                  <td style="padding: 20px;">
                    <h4 style="margin: 0 0 8px 0; color: #1E3A8A; font-size: 15px; font-weight: 700;">🚀 Scale Your Business Faster</h4>
                    <p style="margin: 0; color: #1E40AF; font-size: 14px; line-height: 1.5;">
                      Experience seamless collections, automated bulk payouts, and real-time ledger management. Your financial operations are about to get a major upgrade.
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <tr>
            <td align="center" style="background-color: #F1F5F9; padding: 30px 40px; border-top: 1px solid #E2E8F0;">
              <p style="margin: 0 0 10px 0; color: #64748B; font-size: 13px; font-weight: 600;">
                © ${new Date().getFullYear()} PAYPAXA Technologies. All rights reserved.
              </p>
              <p style="margin: 0 0 15px 0; color: #64748B; font-size: 12px; line-height: 1.5;">
                123 Innovation Drive, Lagos, Nigeria<br>
                Secure Payment Infrastructure
              </p>
              <p style="margin: 0; color: #94A3B8; font-size: 11px; line-height: 1.5;">
                This email was sent securely. If you did not initiate this request or create an account with PAYPAXA, please ignore this email or <a href="mailto:support@paypaxa.com" style="color: #3B82F6; text-decoration: underline;">contact our support team</a> immediately to secure your identity.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>

</body>
</html>
`;

// --- SEND FUNCTION ---
export async function sendVerificationEmail(recipientEmail: string, token: string) {
  try {
    let url = process.env.ZEPTOMAIL_URL || "https://api.zeptomail.com/v1.1/email";
    if (url.endsWith('/send')) url = url.replace('/send', '');
    if (!url.startsWith('http')) url = `https://${url}`;

    let apiToken = process.env.ZEPTOMAIL_API_KEY || "";
    if (!apiToken.startsWith("Zoho-enczapikey")) {
      apiToken = `Zoho-enczapikey ${apiToken}`;
    }

    const client = new SendMailClient({ url, token: apiToken });
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://your-domain.com';
    const verificationLink = `${baseUrl}/verify-email?token=${token}`;

    const htmlContent = wrapEmail(`
      <h2 style="color: #0F172A; margin-top: 0; margin-bottom: 20px; font-size: 22px; font-weight: 700;">Action Required: Verify your email</h2>
      <p style="margin: 0 0 15px 0;">Welcome to PAYPAXA. We are thrilled to have you on board as we build the future of payments.</p>
      <p style="margin: 0 0 30px 0;">To ensure the highest level of security for your workspace, please verify your email address to activate your gateway access.</p>
      
      <table width="100%" border="0" cellspacing="0" cellpadding="0">
        <tr>
          <td align="center">
            <table border="0" cellspacing="0" cellpadding="0">
              <tr>
                <td align="center" style="border-radius: 6px;" bgcolor="#2563EB">
                  <a href="${verificationLink}" target="_blank" style="font-size: 16px; font-family: Helvetica, Arial, sans-serif; color: #ffffff; text-decoration: none; text-decoration: none; border-radius: 6px; padding: 14px 32px; border: 1px solid #2563EB; display: inline-block; font-weight: bold;">Secure My Account</a>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
      
      <p style="margin: 30px 0 0 0; font-size: 14px; color: #475569;">
        Or copy and paste this link into your browser:<br>
        <a href="${verificationLink}" style="color: #3B82F6; text-decoration: none; word-break: break-all;">${verificationLink}</a>
      </p>
    `);

    const response = await client.sendMail({
      bounce_address: BOUNCE_EMAIL,
      from: { address: SENDER_EMAIL, name: SENDER_NAME },
      to: [{ email_address: { address: recipientEmail } }],
      subject: "Action Required: Verify your PAYPAXA account",
      htmlbody: htmlContent,
    });

    console.log("✅ ZeptoMail Sent Successfully");
    return true;

  } catch (error: any) {
    console.error("❌ ZeptoMail Error:", JSON.stringify(error, null, 2));
    return false;
  }
}
