import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Handle GET requests (if the user clicks a direct link in their email like /api/auth/verify-email?token=123456)
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const token = searchParams.get('token');

    if (!token) {
      return NextResponse.json({ error: 'Verification token is required' }, { status: 400 });
    }

    return await processVerification(token, request.url);
  } catch (error) {
    console.error('Email Verification Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// Handle POST requests (if your frontend sends the token via a JSON body)
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { token } = body;

    if (!token) {
      return NextResponse.json({ error: 'Verification token is required' }, { status: 400 });
    }

    return await processVerification(token);
  } catch (error) {
    console.error('Email Verification Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// Core Verification Logic shared by both GET and POST
async function processVerification(token: string, requestUrl?: string) {
  try {
    // In our new schema, the verification token/code is stored in twoFactorOtp
    const user = await prisma.user.findFirst({
      where: {
        twoFactorOtp: token,
      },
    });

    if (!user) {
      return NextResponse.json({ error: 'Invalid verification link or code.' }, { status: 400 });
    }

    if (user.twoFactorExpiry && new Date() > user.twoFactorExpiry) {
      return NextResponse.json({ error: 'Verification link has expired. Please register or request a new code.' }, { status: 401 });
    }

    // Mark as verified and securely clear the tokens
    await prisma.user.update({
      where: { id: user.id },
      data: {
        isEmailVerified: true,
        twoFactorOtp: null,
        twoFactorExpiry: null,
      },
    });

    // If it was a GET request (clicked from email), redirect them smoothly to the login page
    if (requestUrl) {
      return NextResponse.redirect(new URL('/login?verified=true', requestUrl));
    }

    // If it was a POST request, return a JSON success message
    return NextResponse.json({ message: 'Email verified successfully. You can now log in.' }, { status: 200 });

  } finally {
    await prisma.$disconnect();
  }
}
