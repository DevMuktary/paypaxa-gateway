import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { token } = body;

    if (!token) {
      return NextResponse.json({ error: 'Verification token is missing.' }, { status: 400 });
    }

    // Find the user with this exact token
    const user = await prisma.user.findFirst({
      where: {
        verificationToken: token,
      },
    });

    if (!user) {
      return NextResponse.json({ error: 'Invalid or expired verification link.' }, { status: 400 });
    }

    // Check if the token has expired
    if (user.verificationExpiry && new Date() > user.verificationExpiry) {
      return NextResponse.json({ error: 'This verification link has expired. Please request a new one.' }, { status: 400 });
    }

    // Token is valid. Update the user to verified and wipe the token data.
    await prisma.user.update({
      where: { id: user.id },
      data: {
        isEmailVerified: true,
        verificationToken: null,
        verificationExpiry: null,
      },
    });

    return NextResponse.json({ message: 'Email verified successfully! Your account is now active.' }, { status: 200 });

  } catch (error) {
    console.error('Verification error:', error);
    return NextResponse.json({ error: 'Internal server error during verification.' }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}
