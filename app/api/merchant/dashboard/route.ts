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

    // 2. FETCH THE AUTHENTICATED USER & THEIR BUSINESSES
    const user = await prisma.user.findUnique({
      where: { id: session.userId },
      include: { businesses: true } // We must include businesses to get the businessId
    });

    if (!user) {
      return NextResponse.json({ error: 'User record not found.' }, { status: 404 });
    }

    // If the user somehow has no businesses, return a clean zero-state
    if (user.businesses.length === 0) {
      return NextResponse.json({
        merchantName: user.firstName,
        totalRevenue: "₦0.00",
        totalTransactionsCount: 0,
        metrics: [
          { label: 'Available Balance', value: '₦0.00', iconColor: '#3B82F6' },
          { label: 'Total Customers', value: '0', iconColor: '#8B5CF6' }, 
          { label: 'Total Transactions', value: '0', iconColor: '#10B981' },
          { label: 'Total Withdrawals', value: '₦0.00', iconColor: '#F59E0B' }, 
        ],
        transactions: []
      }, { status: 200 });
    }

    // Default to the first business for the dashboard overview 
    // (Later, we can let the frontend pass a ?businessId= parameter when switching businesses)
    const activeBusiness = user.businesses[0];

    // ------------------------------------------------------------------
    // 3. DATABASE AGGREGATIONS (Scoped to the Business ID)
    // ------------------------------------------------------------------
    
    const totalTransactionsCount = await prisma.transaction.count({
      where: { businessId: activeBusiness.id } 
    });

    const successfulTxns = await prisma.transaction.aggregate({
      where: { 
        businessId: activeBusiness.id,
        status: 'SUCCESS' 
      },
      _sum: { amount: true }
    });

    // Convert the Prisma Decimal to a standard number safely
    const totalRevenueRaw = successfulTxns._sum.amount ? Number(successfulTxns._sum.amount) : 0;

    // Recent Transactions Ledger
    const recentTxns = await prisma.transaction.findMany({
      where: { businessId: activeBusiness.id },
      orderBy: { createdAt: 'desc' },
      take: 5,
      include: { customer: true } // Include the customer data to get their name
    });

    // ------------------------------------------------------------------
    // 4. FORMAT RESPONSE FOR FRONTEND
    // ------------------------------------------------------------------
    const dashboardData = {
      merchantName: user.firstName,
      totalRevenue: `₦${totalRevenueRaw.toLocaleString(undefined, { minimumFractionDigits: 2 })}`,
      totalTransactionsCount: totalTransactionsCount,
      metrics: [
        { label: 'Available Balance', value: `₦${totalRevenueRaw.toLocaleString(undefined, { minimumFractionDigits: 2 })}`, iconColor: '#3B82F6' },
        { label: 'Total Customers', value: '0', iconColor: '#8B5CF6' }, // We'll query customer count later
        { label: 'Total Transactions', value: totalTransactionsCount.toString(), iconColor: '#10B981' },
        { label: 'Total Withdrawals', value: '₦0.00', iconColor: '#F59E0B' }, 
      ],
      transactions: recentTxns.map((txn: any) => ({
        reference: txn.reference || txn.id,
        customerName: txn.customer ? `${txn.customer.firstName || ''} ${txn.customer.lastName || ''}`.trim() || txn.customer.email : "Guest Checkout", 
        amount: Number(txn.amount), // Ensure Decimal is converted to a readable Number
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
