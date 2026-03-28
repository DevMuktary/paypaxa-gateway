import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { getSession } from '@/lib/auth'; // Ensure this matches your actual auth import

const prisma = new PrismaClient();

// Helper function to resolve which business the user is currently editing
async function getTargetBusiness(userId: string, requestedBusinessId?: string | null) {
  if (requestedBusinessId) {
    // Strict Security Check: Ensure the logged-in user actually owns this specific business
    return await prisma.business.findFirst({
      where: { id: requestedBusinessId, userId: userId }
    });
  }
  
  // Fallback for MVP: If no business ID is passed, grab their most recent business
  return await prisma.business.findFirst({
    where: { userId: userId },
    orderBy: { createdAt: 'desc' }
  });
}

// 1. LOAD DATA (When the user opens the page)
export async function GET(request: Request) {
  try {
    const session = await getSession();
    if (!session?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    // Extract optional businessId from the URL (e.g., ?businessId=xyz)
    const { searchParams } = new URL(request.url);
    const requestedBusinessId = searchParams.get('businessId');

    const business = await getTargetBusiness(session.id, requestedBusinessId);
    if (!business) {
      return NextResponse.json({ error: 'No business found for this user' }, { status: 404 });
    }

    // Fetch the compliance record SPECIFICALLY for this business
    const compliance = await prisma.compliance.findUnique({
      where: { businessId: business.id }
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
    
    // The frontend can pass businessId in the body if the user switched businesses
    const business = await getTargetBusiness(session.id, body.businessId);
    if (!business) {
      return NextResponse.json({ error: 'Invalid business context' }, { status: 403 });
    }

    // Upsert: Update if it exists, Create if it doesn't. 
    // Isolated entirely to the specific businessId.
    const savedProfile = await prisma.compliance.upsert({
      where: { businessId: business.id },
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
        businessId: business.id,
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
