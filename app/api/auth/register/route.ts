import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import { sendVerificationEmail } from '@/lib/email';

const prisma = new PrismaClient();

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password, businessName } = body;

    if (!email || !password || !businessName) {
      return NextResponse.json({ error: 'All fields are required' }, { status: 400 });
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return NextResponse.json({ error: 'Email already registered' }, { status: 400 });
    }

    // Hash the password securely
    const salt = await bcrypt.genSalt(12);
    const passwordHash = await bcrypt.hash(password, salt);

    // Generate secure API keys for the merchant
    const apiPublicKey = `pk_live_${crypto.randomBytes(16).toString('hex')}`;
    const apiSecretKey = `sk_live_${crypto.randomBytes(24).toString('hex')}`;

    // Generate Email Verification Token (valid for 24 hours)
    const verificationToken = crypto.randomBytes(32).toString('hex');
    const verificationExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000);

    // Database Transaction to ensure both Merchant and User are created safely
    const newUser = await prisma.$transaction(async (tx) => {
      const merchant = await tx.merchant.create({
        data: {
          businessName,
          apiPublicKey,
          apiSecretKey,
        }
      });

      const user = await tx.user.create({
        data: {
          email,
          passwordHash,
          merchantId: merchant.id,
          verificationToken,
          verificationExpiry,
        }
      });

      return user;
    });

    // Send the email via ZeptoMail
    await sendVerificationEmail(newUser.email, verificationToken);

    return NextResponse.json({ message: 'Registration successful. Please check your email to verify.' }, { status: 201 });

  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}
