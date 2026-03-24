import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, otp } = body;

    if (!email || !otp) {
      return NextResponse.json({ error: 'Email and OTP code are required' }, { status: 400 });
    }

    // 1. Find the user
    const user = await prisma.user.findUnique({
      where: { email },
      include: { merchant: true } // Include merchant data for the session if needed
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // 2. Validate OTP presence
    if (!user.twoFactorOtp || !user.twoFactorExpiry) {
      return NextResponse.json({ error: 'No authentication code requested. Please login again.' }, { status: 400 });
    }

    // 3. Check Expiry (Is it older than 10 minutes?)
    if (new Date() > user.twoFactorExpiry) {
      return NextResponse.json({ error: 'Authentication code has expired. Please login again.' }, { status: 401 });
    }

    // 4. Verify the actual code
    if (user.twoFactorOtp !== otp) {
      return NextResponse.json({ error: 'Invalid authentication code.' }, { status: 401 });
    }

    // 5. Code is valid! Clear the OTP from the database to prevent reuse
    await prisma.user.update({
      where: { id: user.id },
      data: {
        twoFactorOtp: null,
        twoFactorExpiry: null
      }
    });

    // 6. Return Success 
    // In a production app, you would set a JWT or HTTP-only session cookie right here.
    return NextResponse.json({ 
      message: 'Login successful',
      user: {
        id: user.id,
        firstName: user.firstName,
        merchantId: user.merchantId
      }
    }, { status: 200 });

  } catch (error) {
    console.error('OTP Verification Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, otp } = body;

    if (!email || !otp) {
      return NextResponse.json({ error: 'Email and OTP code are required' }, { status: 400 });
    }

    // 1. Find the user
    const user = await prisma.user.findUnique({
      where: { email },
      include: { merchant: true } // Include merchant data for the session if needed
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // 2. Validate OTP presence
    if (!user.twoFactorOtp || !user.twoFactorExpiry) {
      return NextResponse.json({ error: 'No authentication code requested. Please login again.' }, { status: 400 });
    }

    // 3. Check Expiry (Is it older than 10 minutes?)
    if (new Date() > user.twoFactorExpiry) {
      return NextResponse.json({ error: 'Authentication code has expired. Please login again.' }, { status: 401 });
    }

    // 4. Verify the actual code
    if (user.twoFactorOtp !== otp) {
      return NextResponse.json({ error: 'Invalid authentication code.' }, { status: 401 });
    }

    // 5. Code is valid! Clear the OTP from the database to prevent reuse
    await prisma.user.update({
      where: { id: user.id },
      data: {
        twoFactorOtp: null,
        twoFactorExpiry: null
      }
    });

    // 6. Return Success 
    // In a production app, you would set a JWT or HTTP-only session cookie right here.
    return NextResponse.json({ 
      message: 'Login successful',
      user: {
        id: user.id,
        firstName: user.firstName,
        merchantId: user.merchantId
      }
    }, { status: 200 });

  } catch (error) {
    console.error('OTP Verification Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}
