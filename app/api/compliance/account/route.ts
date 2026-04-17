import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { getSession } from '@/lib/auth';

const prisma = new PrismaClient();

// Helper to get the active business
async function getTargetBusiness(userId: string) {
  return await prisma.business.findFirst({
    where: { userId: userId },
    orderBy: { createdAt: 'desc' }
  });
}

export async function GET() {
  try {
    const session = await getSession();
    if (!session?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const business = await getTargetBusiness(session.id);
    if (!business) return NextResponse.json({ error: 'No business found' }, { status: 404 });

    const compliance = await prisma.compliance.findUnique({
      where: { businessId: business.id },
      select: { bankCode: true, bankName: true, accountNumber: true, accountName: true }
    });

    return NextResponse.json(compliance || {}, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await getSession();
    if (!session?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await request.json();
    const business = await getTargetBusiness(session.id);
    if (!business) return NextResponse.json({ error: 'Invalid business context' }, { status: 403 });

    const savedAccount = await prisma.compliance.upsert({
      where: { businessId: business.id },
      update: {
        bankCode: body.bankCode,
        bankName: body.bankName,
        accountNumber: body.accountNumber,
        accountName: body.accountName,
      },
      create: {
        businessId: business.id,
        bankCode: body.bankCode,
        bankName: body.bankName,
        accountNumber: body.accountNumber,
        accountName: body.accountName,
      }
    });

    return NextResponse.json({ success: true, data: savedAccount }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { getSession } from '@/lib/auth';

const prisma = new PrismaClient();

// Helper to get the active business
async function getTargetBusiness(userId: string) {
  return await prisma.business.findFirst({
    where: { userId: userId },
    orderBy: { createdAt: 'desc' }
  });
}

export async function GET() {
  try {
    const session = await getSession();
    if (!session?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const business = await getTargetBusiness(session.id);
    if (!business) return NextResponse.json({ error: 'No business found' }, { status: 404 });

    const compliance = await prisma.compliance.findUnique({
      where: { businessId: business.id },
      select: { bankCode: true, bankName: true, accountNumber: true, accountName: true }
    });

    return NextResponse.json(compliance || {}, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await getSession();
    if (!session?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await request.json();
    const business = await getTargetBusiness(session.id);
    if (!business) return NextResponse.json({ error: 'Invalid business context' }, { status: 403 });

    const savedAccount = await prisma.compliance.upsert({
      where: { businessId: business.id },
      update: {
        bankCode: body.bankCode,
        bankName: body.bankName,
        accountNumber: body.accountNumber,
        accountName: body.accountName,
      },
      create: {
        businessId: business.id,
        bankCode: body.bankCode,
        bankName: body.bankName,
        accountNumber: body.accountNumber,
        accountName: body.accountName,
      }
    });

    return NextResponse.json({ success: true, data: savedAccount }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { getSession } from '@/lib/auth';

const prisma = new PrismaClient();

// Helper to get the active business
async function getTargetBusiness(userId: string) {
  return await prisma.business.findFirst({
    where: { userId: userId },
    orderBy: { createdAt: 'desc' }
  });
}

export async function GET() {
  try {
    const session = await getSession();
    if (!session?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const business = await getTargetBusiness(session.id);
    if (!business) return NextResponse.json({ error: 'No business found' }, { status: 404 });

    const compliance = await prisma.compliance.findUnique({
      where: { businessId: business.id },
      select: { bankCode: true, bankName: true, accountNumber: true, accountName: true }
    });

    return NextResponse.json(compliance || {}, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await getSession();
    if (!session?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await request.json();
    const business = await getTargetBusiness(session.id);
    if (!business) return NextResponse.json({ error: 'Invalid business context' }, { status: 403 });

    const savedAccount = await prisma.compliance.upsert({
      where: { businessId: business.id },
      update: {
        bankCode: body.bankCode,
        bankName: body.bankName,
        accountNumber: body.accountNumber,
        accountName: body.accountName,
      },
      create: {
        businessId: business.id,
        bankCode: body.bankCode,
        bankName: body.bankName,
        accountNumber: body.accountNumber,
        accountName: body.accountName,
      }
    });

    return NextResponse.json({ success: true, data: savedAccount }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
