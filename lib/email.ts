export async function sendVerificationEmail(recipientEmail: string, token: string) {
  const zeptoMailApiKey = process.env.ZEPTOMAIL_API_KEY;
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://your-railway-domain.railway.app';
  
  const verificationLink = `${baseUrl}/verify-email?token=${token}`;

  const emailData = {
    from: { 
      address: "dev@quadroxtech.cloud", 
      name: "PAYPAXA Security" 
    },
    to: [
      { 
        email_address: { 
          address: recipientEmail 
        } 
      }
    ],
    subject: "Verify your PAYPAXA Account",
    htmlbody: `
      <div style="font-family: Arial, sans-serif; padding: 20px;">
        <h2>Welcome to PAYPAXA</h2>
        <p>Please verify your email address to activate your merchant account and secure your transactions.</p>
        <a href="${verificationLink}" style="display: inline-block; padding: 10px 20px; background-color: #000; color: #fff; text-decoration: none; border-radius: 5px;">Verify Email</a>
        <p style="margin-top: 20px; font-size: 12px; color: #666;">If you did not request this, please ignore this email.</p>
      </div>
    `
  };

  try {
    const response = await fetch("https://api.zeptomail.com/v1.1/email", {
      method: "POST",
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json",
        "Authorization": `Zoho-enczapikey ${zeptoMailApiKey}`
      },
      body: JSON.stringify(emailData)
    });

    if (!response.ok) {
      throw new Error("Failed to send email via ZeptoMail");
    }
    
    return true;
  } catch (error) {
    console.error("Email sending error:", error);
    return false;
  }
}
