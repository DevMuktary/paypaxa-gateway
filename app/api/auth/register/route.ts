import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { sendVerificationEmail } from '@/lib/email';
import { randomInt } from 'crypto';

const prisma = new PrismaClient();

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { firstName, lastName, businessName, country, email, password } = body;

    // Validate inputs
    if (!firstName || !businessName || !country || !email || !password) {
      return NextResponse.json({ error: 'All fields are required.' }, { status: 400 });
    }

    if (password.length < 8) {
      return NextResponse.json({ error: 'Password must be at least 8 characters long.' }, { status: 400 });
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email }
    });

    if (existingUser) {
      return NextResponse.json({ error: 'An account with this email already exists.' }, { status: 409 });
    }

    // Generate secure password hash
    const passwordHash = await bcrypt.hash(password, 12);

    // Generate initial 6-digit OTP for Email Verification
    const verificationCode = randomInt(100000, 1000000).toString();
    const expiryTime = new Date(Date.now() + 15 * 60 * 1000); // 15 mins

    // Database Transaction: Create User AND their default Business
    const result = await prisma.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: {
          firstName,
          lastName: lastName || "",
          email: email.toLowerCase().trim(),
          passwordHash,
          twoFactorOtp: verificationCode,
          twoFactorExpiry: expiryTime,
          isEmailVerified: false,
          businesses: {
            create: {
              name: businessName,
              email: email.toLowerCase().trim(),
              kycTier: 'UNVERIFIED',
              isLiveEnabled: false // Starts strictly in Sandbox mode
            }
          }
        },
        include: {
          businesses: true
        }
      });

      return user;
    });

    // Send the actual ZeptoMail Verification Email
    const emailSent = await sendVerificationEmail(result.email, verificationCode);

    if (!emailSent) {
      console.warn(`Failed to send email to ${result.email}, but account was created.`);
    }

    return NextResponse.json({ 
      message: 'Account created successfully. Please verify your email.',
      userId: result.id 
    }, { status: 201 });

  } catch (error) {
    console.error('Registration Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}
