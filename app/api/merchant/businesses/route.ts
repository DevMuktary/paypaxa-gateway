import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { getSession } from '@/lib/auth';

const prisma = new PrismaClient();

export async function GET(request: Request) {
  try {
    const session = await getSession();
    
    if (!session || !session.userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { id: session.userId },
      include: { 
        businesses: {
          orderBy: { createdAt: 'asc' }
        } 
      }
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Map database businesses to the format our sidebar expects
    const formattedBusinesses = user.businesses.map((biz, index) => ({
      id: biz.id,
      name: biz.name,
      role: 'Owner', // Future-proofing for when you add team invites
      isActive: index === 0, // Default the first created business to Active
      isLiveEnabled: biz.isLiveEnabled,
      kycTier: biz.kycTier
    }));

    return NextResponse.json({ businesses: formattedBusinesses }, { status: 200 });

  } catch (error) {
    console.error('Business API Error:', error);
    return NextResponse.json({ error: 'Server Error' }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}
