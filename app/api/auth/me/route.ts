import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { getSession } from '@/lib/auth'; // Ensure this matches your auth utility

const prisma = new PrismaClient();

export async function GET() {
  try {
    const session = await getSession();
    
    if (!session?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Fetch only the safe, necessary fields (never send the passwordHash!)
    const user = await prisma.user.findUnique({
      where: { id: session.id },
      select: {
        firstName: true,
        lastName: true,
        email: true,
      }
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json(user, { status: 200 });
  } catch (error) {
    console.error("Failed to fetch user:", error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
