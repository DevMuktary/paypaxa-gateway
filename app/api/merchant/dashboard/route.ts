import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { getSession } from '@/lib/auth';

const prisma = new PrismaClient();

export async function GET(request: Request) {
  try {
    const session = await getSession();
    
    if (!session || !session.userId) {
      return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { id: session.userId },
      include: { businesses: true } 
    });

    if (!user || user.businesses.length === 0) {
      return NextResponse.json({ error: 'No business found.' }, { status: 404 });
    }

    const activeBusiness = user.businesses[0];

    const totalTransactionsCount = await prisma.transaction.count({
      where: { businessId: activeBusiness.id } 
    });

    const successfulTxns = await prisma.transaction.aggregate({
      where: { businessId: activeBusiness.id, status: 'SUCCESS' },
      _sum: { amount: true }
    });

    const totalRevenueRaw = successfulTxns._sum.amount ? Number(successfulTxns._sum.amount) : 0;

    const recentTxns = await prisma.transaction.findMany({
      where: { businessId: activeBusiness.id },
      orderBy: { createdAt: 'desc' },
      take: 5,
      include: { customer: true } 
    });

    const dashboardData = {
      merchantName: user.firstName,
      businessName: activeBusiness.name,
      isLiveEnabled: activeBusiness.isLiveEnabled, // Crucial for the UI
      kycTier: activeBusiness.kycTier,             // Crucial for the UI
      totalRevenue: `₦${totalRevenueRaw.toLocaleString(undefined, { minimumFractionDigits: 2 })}`,
      totalTransactionsCount: totalTransactionsCount,
      metrics: [
        { label: 'Available Balance', value: `₦${totalRevenueRaw.toLocaleString(undefined, { minimumFractionDigits: 2 })}`, iconColor: '#3B82F6' },
        { label: 'Total Customers', value: '0', iconColor: '#8B5CF6' }, 
        { label: 'Total Transactions', value: totalTransactionsCount.toString(), iconColor: '#10B981' },
        { label: 'Total Withdrawals', value: '₦0.00', iconColor: '#F59E0B' }, 
      ],
      transactions: recentTxns.map((txn: any) => ({
        reference: txn.reference || txn.id,
        customerName: txn.customer ? `${txn.customer.firstName || ''} ${txn.customer.lastName || ''}`.trim() || txn.customer.email : "Guest Checkout", 
        amount: Number(txn.amount),
        status: txn.status,
        createdAt: txn.createdAt
      }))
    };

    return NextResponse.json(dashboardData, { status: 200 });

  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}
