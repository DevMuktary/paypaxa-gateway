import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { encrypt } from '@/lib/auth';
import { cookies } from 'next/headers';

const prisma = new PrismaClient();

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, otp } = body;

    if (!email || !otp) {
      return NextResponse.json({ error: 'Email and OTP code are required' }, { status: 400 });
    }

    const cleanOtp = otp.toString().trim();
    const cleanEmail = email.toString().trim().toLowerCase();

    const user = await prisma.user.findUnique({
      where: { email: cleanEmail }
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    if (!user.twoFactorOtp || !user.twoFactorExpiry) {
      return NextResponse.json({ error: 'No authentication code requested. Please login again.' }, { status: 400 });
    }

    if (new Date() > user.twoFactorExpiry) {
      return NextResponse.json({ error: 'Authentication code has expired. Please login again.' }, { status: 401 });
    }

    if (user.twoFactorOtp !== cleanOtp) {
      return NextResponse.json({ error: 'Invalid 6-digit code. Please try again.' }, { status: 401 });
    }

    // Code is valid! Clear the OTP to prevent replay attacks
    await prisma.user.update({
      where: { id: user.id },
      data: {
        twoFactorOtp: null,
        twoFactorExpiry: null
      }
    });

    // --- SECURE SESSION CREATION ---
    const sessionData = {
      userId: user.id,
      email: user.email,
    };

    const token = await encrypt(sessionData);

    // Set the secure, HTTP-Only cookie
    cookies().set('paypaxa_session', token, {
      httpOnly: true, // Prevents JavaScript from reading the cookie (Stops XSS attacks)
      secure: process.env.NODE_ENV === 'production', // Requires HTTPS in production
      sameSite: 'lax',
      maxAge: 60 * 60 * 24, // 24 Hours
      path: '/',
    });

    return NextResponse.json({ message: 'Login successful' }, { status: 200 });

  } catch (error) {
    console.error('OTP Verification Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}
