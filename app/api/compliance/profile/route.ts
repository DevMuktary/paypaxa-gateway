import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { getSession } from '@/lib/auth'; // Assuming your JWT logic is here based on your previous code

const prisma = new PrismaClient();

// 1. LOAD DATA (When the user opens the page on any device)
export async function GET(request: Request) {
  try {
    const session = await getSession();
    if (!session?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    // Fetch the user's compliance record from Prisma
    const compliance = await prisma.compliance.findUnique({
      where: { userId: session.id }
    });

    return NextResponse.json(compliance || {}, { status: 200 });
  } catch (error) {
    console.error("Failed to load profile:", error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

// 2. SAVE DATA (When the user clicks "Save and Continue")
export async function POST(request: Request) {
  try {
    const session = await getSession();
    if (!session?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await request.json();

    // Upsert: Update if it exists, Create if it doesn't
    const savedProfile = await prisma.compliance.upsert({
      where: { userId: session.id },
      update: {
        businessType: body.businessType,
        tradingName: body.tradingName,
        description: body.description,
        staffSize: body.staffSize,
        salesVolume: body.salesVolume,
        industry: body.industry,
        category: body.category,
        legalBusinessName: body.legalBusinessName,
        registrationType: body.registrationType,
      },
      create: {
        userId: session.id,
        businessType: body.businessType,
        tradingName: body.tradingName,
        description: body.description,
        staffSize: body.staffSize,
        salesVolume: body.salesVolume,
        industry: body.industry,
        category: body.category,
        legalBusinessName: body.legalBusinessName,
        registrationType: body.registrationType,
      }
    });

    return NextResponse.json({ success: true, data: savedProfile }, { status: 200 });
  } catch (error) {
    console.error("Failed to save profile:", error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
