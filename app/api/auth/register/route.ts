import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import { sendVerificationEmail } from '@/lib/email';

const prisma = new PrismaClient();

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { 
      country, businessName, firstName, lastName, 
      email, phoneNumber, password, confirmPassword, 
      businessType, isDeveloper 
    } = body;

    // Basic Validation
    if (!email || !password || !businessName || !firstName || !lastName || !phoneNumber) {
      return NextResponse.json({ error: 'All fields are required' }, { status: 400 });
    }

    if (password !== confirmPassword) {
      return NextResponse.json({ error: 'Passwords do not match' }, { status: 400 });
    }

    if (password.length < 8) {
      return NextResponse.json({ error: 'Password must be at least 8 characters' }, { status: 400 });
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

    // Generate Email Verification Token
    const verificationToken = crypto.randomBytes(32).toString('hex');
    const verificationExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000);

    // Set KYC Tier based on Business Type
    const kycTier = businessType === 'REGISTERED' ? 2 : 1;

    // Database Transaction
    const newUser = await prisma.$transaction(async (tx) => {
      const merchant = await tx.merchant.create({
        data: {
          businessName,
          country,
          businessType,
          kycTier,
          apiPublicKey,
          apiSecretKey,
        }
      });

      const user = await tx.user.create({
        data: {
          firstName,
          lastName,
          email,
          phoneNumber,
          passwordHash,
          isDeveloper: isDeveloper === 'yes',
          merchantId: merchant.id,
          verificationToken,
          verificationExpiry,
        }
      });

      return user;
    });

    // Send the email via ZeptoMail
    await sendVerificationEmail(newUser.email, verificationToken);

    return NextResponse.json({ message: 'Account created successfully! Please check your email to verify.' }, { status: 201 });

  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}
