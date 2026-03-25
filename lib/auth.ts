import { jwtVerify, SignJWT } from 'jose';
import { cookies } from 'next/headers';

// In production (Railway), you MUST set a JWT_SECRET environment variable.
// This is a fallback for local development.
const SECRET_KEY = new TextEncoder().encode(process.env.JWT_SECRET || 'super');

// 1. Encrypt the User ID into a Token
export async function encrypt(payload: any) {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('24h') // The session expires in 24 hours
    .sign(SECRET_KEY);
}

// 2. Decrypt the Token back into a User ID
export async function decrypt(token: string): Promise<any> {
  try {
    const { payload } = await jwtVerify(token, SECRET_KEY);
    return payload;
  } catch (error) {
    return null; // Token is invalid or expired
  }
}

// 3. Helper to instantly grab the current user's session
export async function getSession() {
  const sessionCookie = cookies().get('paypaxa_session')?.value;
  if (!sessionCookie) return null;
  return await decrypt(sessionCookie);
}
