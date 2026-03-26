import { SendMailClient } from "zeptomail";

// Environment variables fallback for local testing
const url = "api.zeptomail.com/";
const token = process.env.ZEPTOMAIL_TOKEN || "your-zeptomail-token";
const SENDER_EMAIL = process.env.ZEPTOMAIL_SENDER_EMAIL || "noreply@paypaxa.com";
const SENDER_NAME = "PAYPAXA";
const BOUNCE_EMAIL = process.env.ZEPTOMAIL_BOUNCE_EMAIL || "bounce@paypaxa.com";

const client = new SendMailClient({ url, token });

// 1. Initial Registration Verification Email
export async function sendVerificationEmail(recipientEmail: string, verificationCode: string) {
  try {
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

    await client.sendMail({
      bounce_address: BOUNCE_EMAIL,
      from: { address: SENDER_EMAIL, name: SENDER_NAME },
      to: [{ email_address: { address: recipientEmail, name: "Merchant" } }],
      subject: "Verify your PAYPAXA Account",
      htmlbody: htmlContent,
    });

    return true;
  } catch (error) {
    console.error("ZeptoMail Verification Email Error:", error);
    return false;
  }
}

// 2. Login Two-Factor (2FA) OTP Email
// Updated to accept the firstName argument and use it in the email!
export async function sendTwoFactorEmail(recipientEmail: string, firstName: string, otpCode: string) {
  try {
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

    await client.sendMail({
      bounce_address: BOUNCE_EMAIL,
      from: { address: SENDER_EMAIL, name: SENDER_NAME },
      // ZeptoMail SDK gets the actual user's first name here too
      to: [{ email_address: { address: recipientEmail, name: firstName } }],
      subject: "Your PAYPAXA Login OTP",
      htmlbody: htmlContent,
    });

    return true;
  } catch (error) {
    console.error("ZeptoMail 2FA Error:", error);
    return false;
  }
}
