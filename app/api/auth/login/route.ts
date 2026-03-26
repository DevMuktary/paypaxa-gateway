import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { randomInt } from 'crypto';
import { sendTwoFactorEmail } from '@/lib/email';

const prisma = new PrismaClient();

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required' }, { status: 400 });
    }

    // Force lowercase to prevent case-sensitive login failures
    const cleanEmail = email.toLowerCase().trim();

    // 1. Find the user
    const user = await prisma.user.findUnique({ where: { email: cleanEmail } });
    if (!user) {
      return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 });
    }

    // 2. Check if email is verified
    if (!user.isEmailVerified) {
      return NextResponse.json({ error: 'Please verify your email address before logging in.' }, { status: 403 });
    }

    // 3. Verify Password
    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
    if (!isPasswordValid) {
      return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 });
    }

    // 4. Generate 6-Digit OTP (Cryptographically Secure)
    const otpCode = randomInt(100000, 1000000).toString(); // Generates 100000 to 999999
    const expiryTime = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes from now

    // 5. Save OTP to Database
    await prisma.user.update({
      where: { id: user.id },
      data: {
        twoFactorOtp: otpCode,
        twoFactorExpiry: expiryTime
      }
    });

    // 6. Send the Email
    const emailSent = await sendTwoFactorEmail(user.email, user.firstName, otpCode);
    if (!emailSent) {
      return NextResponse.json({ error: 'Failed to send authentication email. Please try again.' }, { status: 500 });
    }

    return NextResponse.json({ message: 'OTP sent successfully' }, { status: 200 });

  } catch (error) {
    console.error('Login Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}
