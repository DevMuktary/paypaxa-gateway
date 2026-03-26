import { SendMailClient } from "zeptomail";

// Environment variables fallback for local testing
const url = "api.zeptomail.com/";
const token = process.env.ZEPTOMAIL_TOKEN || "your-zeptomail-token";
const SENDER_EMAIL = process.env.ZEPTOMAIL_SENDER_EMAIL || "noreply@paypaxa.com";
const SENDER_NAME = "PAYPAXA";
const BOUNCE_EMAIL = process.env.ZEPTOMAIL_BOUNCE_EMAIL || "bounce@paypaxa.com";

const client = new SendMailClient({ url, token });

export async function sendVerificationEmail(recipientEmail: string, verificationCode: string) {
  try {
    // Beautiful, Enterprise-grade HTML Email Template
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

    // Strict ZeptoMail v7.0.2 Configuration
    await client.sendMail({
      bounce_address: BOUNCE_EMAIL,
      from: { 
        address: SENDER_EMAIL, 
        name: SENDER_NAME 
      },
      to: [
        { 
          email_address: { 
            address: recipientEmail, 
            name: "Merchant" // <--- The strict TypeScript fix 
          } 
        }
      ],
      subject: "Verify your PAYPAXA Account",
      htmlbody: htmlContent,
    });

    return true;
  } catch (error) {
    console.error("ZeptoMail Verification Email Error:", error);
    return false;
  }
}
