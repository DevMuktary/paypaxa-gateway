// @ts-ignore - ZeptoMail does not provide official TypeScript types
import { SendMailClient } from "zeptomail";

// --- CONFIGURATION ---
// IMPORTANT: This MUST match the exact email address you verified in ZeptoMail!
const SENDER_EMAIL = "hello@paypaxa.com"; 
const SENDER_NAME = "PAYPAXA Security";

// The address where failed delivery notifications will be sent. 
// Usually, you can use the same verified email as your SENDER_EMAIL.
const BOUNCE_EMAIL = "hello@paypaxa.com"; 

// --- HTML TEMPLATE WRAPPER ---
const wrapEmail = (content: string) => `
<!DOCTYPE html>
<html>
<head>
<style>
  body { font-family: 'system-ui', -apple-system, sans-serif; background-color: #F3F4F6; margin: 0; padding: 0; }
  .container { max-width: 600px; margin: 40px auto; background: #FFFFFF; border-radius: 12px; overflow: hidden; box-shadow: 0 10px 25px rgba(0,0,0,0.05); border: 1px solid #E2E8F0; }
  .header { background: #060B19; padding: 30px; text-align: center; }
  .logo { color: #FFFFFF; font-size: 24px; font-weight: 800; text-decoration: none; letter-spacing: 1px; }
  .content { padding: 40px 30px; color: #334155; line-height: 1.6; font-size: 16px; }
  .btn { display: inline-block; background: #2563EB; color: #FFFFFF; padding: 14px 28px; border-radius: 8px; text-decoration: none; font-weight: bold; margin-top: 24px; transition: background 0.2s; }
  .footer { background: #F8FAFC; padding: 20px; text-align: center; font-size: 13px; color: #64748B; border-top: 1px solid #E2E8F0; }
</style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="logo">PAYPAXA</div>
    </div>
    <div class="content">
      ${content}
    </div>
    <div class="footer">
      &copy; ${new Date().getFullYear()} PAYPAXA. All rights reserved.<br>
      Secure Payment Infrastructure.
    </div>
  </div>
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
      <h2 style="color: #060B19; margin-top: 0; font-size: 22px;">Verify your email</h2>
      <p>Welcome to PAYPAXA. We are thrilled to have you on board.</p>
      <p>Please verify your email address to activate your workspace and secure your gateway access.</p>
      <div style="text-align: center;">
        <a href="${verificationLink}" class="btn">Verify Email Address</a>
      </div>
      <p style="margin-top: 30px; font-size: 14px; color: #64748B;">If you did not create an account, you can safely ignore this email.</p>
    `);

    const response = await client.sendMail({
      bounce_address: BOUNCE_EMAIL, // <-- This explicitly fixes the empty bounce address error
      from: { address: SENDER_EMAIL, name: SENDER_NAME },
      to: [{ email_address: { address: recipientEmail } }],
      subject: "Verify your PAYPAXA Account",
      htmlbody: htmlContent,
    });

    console.log("✅ ZeptoMail Sent Successfully");
    return true;

  } catch (error: any) {
    console.error("❌ ZeptoMail Error:", JSON.stringify(error, null, 2));
    return false;
  }
}
