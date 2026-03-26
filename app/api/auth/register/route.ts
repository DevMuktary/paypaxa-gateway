import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { sendVerificationEmail } from '@/lib/email';
import crypto, { randomInt } from 'crypto';

const prisma = new PrismaClient();

// Helper to generate secure random keys
const generateKey = (prefix: string, bytes: number) => {
  return `${prefix}_${crypto.randomBytes(bytes).toString('hex')}`;
};

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { firstName, lastName, businessName, country, email, password } = body;

    if (!firstName || !businessName || !country || !email || !password) {
      return NextResponse.json({ error: 'All fields are required.' }, { status: 400 });
    }

    if (password.length < 8) {
      return NextResponse.json({ error: 'Password must be at least 8 characters long.' }, { status: 400 });
    }

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) return NextResponse.json({ error: 'Email already exists.' }, { status: 409 });

    const passwordHash = await bcrypt.hash(password, 12);
    const verificationCode = randomInt(100000, 1000000).toString();
    const expiryTime = new Date(Date.now() + 15 * 60 * 1000); 

    // Generate Initial Sandbox Keys
    const pubKey = generateKey('pk_test', 16);
    const secKey = generateKey('sk_test', 24);

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
              isLiveEnabled: false,
              apiKeys: {
                create: {
                  environment: 'SANDBOX',
                  publicKey: pubKey,
                  secretKey: secKey,
                  webhookUrl: ''
                }
              }
            }
          }
        },
      });
      return user;
    });

    await sendVerificationEmail(result.email, verificationCode);

    return NextResponse.json({ message: 'Account created successfully.', userId: result.id }, { status: 201 });

  } catch (error) {
    console.error('Registration Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}
