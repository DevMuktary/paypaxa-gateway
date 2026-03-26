import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { getSession } from '@/lib/auth';
import crypto from 'crypto';

const prisma = new PrismaClient();

const generateKey = (prefix: string, bytes: number) => {
  return `${prefix}_${crypto.randomBytes(bytes).toString('hex')}`;
};

export async function GET(request: Request) {
  try {
    const session = await getSession();
    if (!session || !session.userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const user = await prisma.user.findUnique({
      where: { id: session.userId },
      include: { businesses: { include: { apiKeys: true } } }
    });

    if (!user || user.businesses.length === 0) return NextResponse.json({ error: 'No business found.' }, { status: 404 });

    const activeBusiness = user.businesses[0]; // Active business
    let keys = activeBusiness.apiKeys;

    // AUTO-HEAL: If this user was created before we added auto-generation, generate a sandbox key now.
    const hasSandbox = keys.find(k => k.environment === 'SANDBOX');
    if (!hasSandbox) {
      const newKey = await prisma.apiKey.create({
        data: {
          businessId: activeBusiness.id,
          environment: 'SANDBOX',
          publicKey: generateKey('pk_test', 16),
          secretKey: generateKey('sk_test', 24),
          webhookUrl: ''
        }
      });
      keys.push(newKey);
    }

    return NextResponse.json({ 
      isLiveEnabled: activeBusiness.isLiveEnabled,
      kycTier: activeBusiness.kycTier,
      keys 
    }, { status: 200 });

  } catch (error) {
    console.error('API Keys Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}

// Route to update Webhook URLs
export async function PATCH(request: Request) {
  try {
    const session = await getSession();
    if (!session || !session.userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await request.json();
    const { keyId, webhookUrl } = body;

    // Verify ownership before updating
    const user = await prisma.user.findUnique({
      where: { id: session.userId },
      include: { businesses: { include: { apiKeys: true } } }
    });

    const ownsKey = user?.businesses.some(b => b.apiKeys.some(k => k.id === keyId));
    if (!ownsKey) return NextResponse.json({ error: 'Key not found or unauthorized' }, { status: 403 });

    await prisma.apiKey.update({
      where: { id: keyId },
      data: { webhookUrl }
    });

    return NextResponse.json({ message: 'Webhook updated successfully' }, { status: 200 });

  } finally {
    await prisma.$disconnect();
  }
}
