// Environment variables fallback for local testing
const SENDER_EMAIL = process.env.ZEPTOMAIL_SENDER_EMAIL || "noreply@paypaxa.com";
const SENDER_NAME = "PAYPAXA";
const BOUNCE_EMAIL = process.env.ZEPTOMAIL_BOUNCE_EMAIL || "bounce@paypaxa.com";

// 🚀 NATIVE FETCH WRAPPER (Bypasses all SDK TypeScript errors and server crashes)
async function sendZeptoMail(toEmail: string, toName: string, subject: string, htmlContent: string) {
  try {
    const rawToken = process.env.ZEPTOMAIL_TOKEN || "your-zeptomail-token";
    
    // Ensure the token has the strict prefix ZeptoMail requires
    const authHeader = rawToken.startsWith("Zoho-enczapikey") ? rawToken : `Zoho-enczapikey ${rawToken}`;

    const response = await fetch("https://api.zeptomail.com/v1.1/email", {
      method: "POST",
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json",
        "Authorization": authHeader
      },
      body: JSON.stringify({
        bounce_address: BOUNCE_EMAIL,
        from: { address: SENDER_EMAIL, name: SENDER_NAME },
        to: [{ email_address: { address: toEmail, name: toName } }],
        subject: subject,
        htmlbody: htmlContent
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`[CRITICAL] ZeptoMail API Rejected (${response.status}):`, errorText);
      return false; // Gracefully fail without crashing the server
    }

    return true;
  } catch (error) {
    console.error("[CRITICAL] ZeptoMail Network Error:", error);
    return false; // Gracefully fail without crashing the server
  }
}

// 1. Initial Registration Verification Email
export async function sendVerificationEmail(recipientEmail: string, verificationCode: string) {
  const htmlContent = `
    <div style="font-family: 'Inter', Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 40px 20px; background-color: #FAFAFA;">
      <div style="background-color: #FFFFFF; padding: 40px; border-radius: 16px; border: 1px solid #E5E7EB; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);">
        <div style="text-align: center; margin-bottom: 32px;">
          <h1 style="color: #111827; font-size: 24px; margin: 0;">Welcome to PAYPAXA</h1>
        </div>
        
        <p style="font-size: 16px; color: #4B5563; line-height: 1.6; margin-bottom: 24px;">
          Hello, <br/><br/>
          Thank you for registering. To secure your account, please use the verification code below:
        </p>
        
        <div style="text-align: center; margin: 32px 0;">
          <span style="display: inline-block; font-size: 32px; font-weight: 800; letter-spacing: 8px; color: #3B82F6; background: #EFF6FF; padding: 16px 32px; border-radius: 12px; border: 1px dashed #3B82F6;">
            ${verificationCode}
          </span>
        </div>
        
        <p style="font-size: 14px; color: #6B7280; text-align: center; margin-bottom: 32px;">
          This code is highly secure and will expire in 15 minutes.
        </p>
        
        <hr style="border: none; border-top: 1px solid #E5E7EB; margin: 32px 0;" />
        
        <p style="font-size: 12px; color: #9CA3AF; text-align: center; margin: 0;">
          If you did not request this, please ignore this email or contact our support team immediately.
        </p>
      </div>
    </div>
  `;

  return await sendZeptoMail(recipientEmail, "Merchant", "Verify your PAYPAXA Account", htmlContent);
}

// 2. Login Two-Factor (2FA) OTP Email
export async function sendTwoFactorEmail(recipientEmail: string, firstName: string, otpCode: string) {
  const htmlContent = `
    <div style="font-family: 'Inter', Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 40px 20px; background-color: #FAFAFA;">
      <div style="background-color: #FFFFFF; padding: 40px; border-radius: 16px; border: 1px solid #E5E7EB; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);">
        <div style="text-align: center; margin-bottom: 32px;">
          <h1 style="color: #111827; font-size: 24px; margin: 0;">Login Attempt</h1>
        </div>
        
        <p style="font-size: 16px; color: #4B5563; line-height: 1.6; margin-bottom: 24px;">
          Hello ${firstName}, <br/><br/>
          A login attempt was made to your PAYPAXA account. Please use the OTP below to complete your login securely:
        </p>
        
        <div style="text-align: center; margin: 32px 0;">
          <span style="display: inline-block; font-size: 32px; font-weight: 800; letter-spacing: 8px; color: #10B981; background: #ECFDF5; padding: 16px 32px; border-radius: 12px; border: 1px dashed #10B981;">
            ${otpCode}
          </span>
        </div>
        
        <p style="font-size: 14px; color: #6B7280; text-align: center; margin-bottom: 32px;">
          This code will expire in 15 minutes. Never share this code with anyone.
        </p>
        
        <hr style="border: none; border-top: 1px solid #E5E7EB; margin: 32px 0;" />
        
        <p style="font-size: 12px; color: #9CA3AF; text-align: center; margin: 0;">
          If you did not attempt to log in, please secure your account by resetting your password.
        </p>
      </div>
    </div>
  `;

  return await sendZeptoMail(recipientEmail, firstName, "Your PAYPAXA Login OTP", htmlContent);
}
