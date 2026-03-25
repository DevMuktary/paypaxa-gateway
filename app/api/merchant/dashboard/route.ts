import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { getSession } from '@/lib/auth';

const prisma = new PrismaClient();

export async function GET(request: Request) {
  try {
    // 1. STRICT AUTHENTICATION GATE
    const session = await getSession();
    
    if (!session || !session.userId) {
      return NextResponse.json({ error: 'Unauthorized. Secure session required.' }, { status: 401 });
    }

    // 2. FETCH THE AUTHENTICATED USER
    const user = await prisma.user.findUnique({
      where: { id: session.userId }
    });

    if (!user) {
      return NextResponse.json({ error: 'User record not found.' }, { status: 404 });
    }

    // ------------------------------------------------------------------
    // 3. DATABASE AGGREGATIONS (Scoped strictly to this user's ID)
    // ------------------------------------------------------------------
    
    // Total Transactions Count
    // (Note: Replace `userId` with `merchantId` if your Prisma schema uses a separate Merchant table)
    const totalTransactionsCount = await prisma.transaction.count({
      where: { userId: user.id } 
    });

    // Total Successful Revenue
    const successfulTxns = await prisma.transaction.aggregate({
      where: { 
        userId: user.id,
        status: 'SUCCESS' // Make sure this matches your Prisma ENUM
      },
      _sum: { amount: true }
    });

    const totalRevenueRaw = successfulTxns._sum.amount || 0;

    // Recent Transactions Ledger
    const recentTxns = await prisma.transaction.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: 'desc' },
      take: 5,
    });

    // ------------------------------------------------------------------
    // 4. FORMAT RESPONSE FOR FRONTEND
    // ------------------------------------------------------------------
    const dashboardData = {
      merchantName: user.firstName || "Merchant",
      totalRevenue: `₦${totalRevenueRaw.toLocaleString(undefined, { minimumFractionDigits: 2 })}`,
      totalTransactionsCount: totalTransactionsCount,
      metrics: [
        { label: 'Available Balance', value: `₦${totalRevenueRaw.toLocaleString()}`, iconColor: '#3B82F6' },
        { label: 'Total Customers', value: '0', iconColor: '#8B5CF6' }, 
        { label: 'Total Transactions', value: totalTransactionsCount.toString(), iconColor: '#10B981' },
        { label: 'Total Withdrawals', value: '₦0.00', iconColor: '#F59E0B' }, 
      ],
      transactions: recentTxns.map((txn: any) => ({
        reference: txn.reference || txn.id,
        customerName: "Guest Checkout", 
        amount: txn.amount,
        status: txn.status,
        createdAt: txn.createdAt
      }))
    };

    return NextResponse.json(dashboardData, { status: 200 });

  } catch (error) {
    console.error('Dashboard API Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}
