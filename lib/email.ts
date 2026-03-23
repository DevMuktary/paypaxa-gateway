// @ts-ignore - ZeptoMail does not provide official TypeScript types
import { SendMailClient } from "zeptomail";

// --- CONFIGURATION ---
const SENDER_EMAIL = "hello@paypaxa.com"; 
const SENDER_NAME = "PAYPAXA Security";
const BOUNCE_EMAIL = "bounce@bounce-zem.paypaxa.com"; 

// Anti-Spam Requirement: Add a real or registered business address here
const COMPANY_ADDRESS = "123 Financial District, Victoria Island, Lagos, Nigeria";

// --- HTML TEMPLATE WRAPPER (Enterprise Table Layout) ---
const wrapEmail = (content: string, baseUrl: string) => `
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
  <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>PAYPAXA</title>
  <style type="text/css">
    body { margin: 0; padding: 0; min-width: 100%; background-color: #F3F4F6; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; }
    table { border-spacing: 0; font-family: sans-serif; color: #334155; }
    td { padding: 0; }
    img { border: 0; }
    .wrapper { width: 100%; table-layout: fixed; -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; }
    .main { background-color: #FFFFFF; margin: 0 auto; width: 100%; max-width: 600px; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 10px rgba(0,0,0,0.05); }
    .btn { display: inline-block; background-color: #2563EB; color: #FFFFFF; text-decoration: none; padding: 14px 28px; border-radius: 6px; font-weight: bold; font-size: 16px; margin-top: 10px; margin-bottom: 10px; }
    .btn:hover { background-color: #1D4ED8; }
  </style>
</head>
<body style="margin: 0; padding: 0; background-color: #F3F4F6;">
  <center class="wrapper" style="width: 100%; table-layout: fixed; background-color: #F3F4F6; padding: 40px 0;">
    <table class="main" width="100%" max-width="600" align="center" style="background-color: #FFFFFF; border-radius: 12px; border: 1px solid #E2E8F0; overflow: hidden; margin: 0 auto;">
      
      <tr>
        <td style="background-color: #060B19; padding: 30px; text-align: center;">
          <a href="${baseUrl}" target="_blank" style="text-decoration: none;">
            <img src="${baseUrl}/logo.png" alt="PAYPAXA Logo" width="180" style="max-width: 180px; display: block; margin: 0 auto; color: #FFFFFF; font-size: 24px; font-weight: bold; text-decoration: none; letter-spacing: 1px;" />
          </a>
        </td>
      </tr>

      <tr>
        <td style="padding: 40px 30px; line-height: 1.6; font-size: 16px; color: #334155;">
          ${content}
        </td>
      </tr>

      <tr>
        <td style="padding: 0 30px 30px 30px; text-align: center;">
          <a href="${baseUrl}" target="_blank">
            <img src="${baseUrl}/promo-banner-placeholder.png" alt="Learn more about PAYPAXA tools" width="100%" style="max-width: 100%; height: auto; border-radius: 8px; display: block; background-color: #F8FAFC; border: 1px solid #E2E8F0;" />
          </a>
        </td>
      </tr>

      <tr>
        <td style="background-color: #F8FAFC; padding: 30px; text-align: center; border-top: 1px solid #E2E8F0;">
          <p style="margin: 0 0 10px 0; font-size: 13px; color: #64748B;">
            You are receiving this email because a registration attempt was made using this address on the PAYPAXA gateway.
          </p>
          <p style="margin: 0 0 15px 0; font-size: 13px; color: #64748B;">
            <strong>PAYPAXA Inc.</strong><br/>
            ${COMPANY_ADDRESS}
          </p>
          <p style="margin: 0; font-size: 12px; color: #94A3B8;">
            &copy; ${new Date().getFullYear()} PAYPAXA. All rights reserved.
          </p>
        </td>
      </tr>

    </table>
  </center>
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
    
    // Fallback to your Railway domain if NEXT_PUBLIC_BASE_URL isn't set yet
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://paypaxa.com';
    const verificationLink = `${baseUrl}/verify-email?token=${token}`;

    const htmlContent = wrapEmail(`
      <h2 style="color: #060B19; margin-top: 0; font-size: 24px;">Activate your gateway</h2>
      <p style="margin-bottom: 20px;">Welcome to PAYPAXA. We are thrilled to have you on board.</p>
      <p style="margin-bottom: 30px;">To ensure the security of your transactions and activate your merchant workspace, please verify your email address by clicking the button below.</p>
      
      <div style="text-align: center; margin: 35px 0;">
        <a href="${verificationLink}" class="btn" style="color: #ffffff; text-decoration: none;">Verify Email Address</a>
        </div>

      <p style="margin-top: 30px; font-size: 14px; color: #64748B;">Or copy and paste this link into your browser:</p>
      <p style="font-size: 13px; color: #3B82F6; word-break: break-all;">
        <a href="${verificationLink}" style="color: #3B82F6;">${verificationLink}</a>
      </p>
    `, baseUrl);

    const response = await client.sendMail({
      bounce_address: BOUNCE_EMAIL, 
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
