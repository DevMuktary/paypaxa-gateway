import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request: Request) {
  try {
    // 1. SECURE AUTHENTICATION CHECK GOES HERE
    // In production, you will extract the user's session token or JWT here
    // const session = await getSession();
    // if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    // const userId = session.user.id;

    // ------------------------------------------------------------------
    // 2. THE REAL DATABASE QUERIES (Ready for when your schema is built)
    // ------------------------------------------------------------------
    /*
    const user = await prisma.user.findUnique({ where: { id: userId }, include: { business: true } });
    
    // Aggregate metrics
    const totalTxns = await prisma.transaction.count({ where: { merchantId: user.merchantId } });
    const totalCustomers = await prisma.customer.count({ where: { merchantId: user.merchantId } });
    
    // Calculate balances
    const successfulTxns = await prisma.transaction.aggregate({
      where: { merchantId: user.merchantId, status: 'SUCCESS' },
      _sum: { amount: true }
    });
    
    // Fetch recent transactions
    const recentTxns = await prisma.transaction.findMany({
      where: { merchantId: user.merchantId },
      orderBy: { createdAt: 'desc' },
      take: 5,
      include: { customer: true }
    });
    */

    // ------------------------------------------------------------------
    // 3. ARTIFICIAL DELAY (To demonstrate the Skeleton UI loading state)
    // ------------------------------------------------------------------
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // ------------------------------------------------------------------
    // 4. THE RESPONSE PAYLOAD
    // ------------------------------------------------------------------
    // We are returning formatted data so the frontend renders perfectly.
    const dashboardData = {
      merchantName: "Mukhtar", 
      totalRevenue: "₦1,500,450.00",
      metrics: [
        { label: 'Account Balance', value: '₦1,500,450.00', iconColor: '#3B82F6' },
        { label: 'Total Customers', value: '1,204', iconColor: '#8B5CF6' },
        { label: 'Total Transactions', value: '8,432', iconColor: '#10B981' },
        { label: 'Total Withdrawals', value: '₦540,000.00', iconColor: '#F59E0B' },
      ],
      transactions: [
        { 
          id: 'TRX-1f1917d753...', 
          customer: 'DAARUL HIKMAH intl school', 
          amount: '₦3,000.00', 
          status: 'Success', 
          date: 'Mar 16, 2026 12:41 PM' 
        },
        { 
          id: 'TRX-a7e98bf4cb...', 
          customer: 'Abdussamad salaudeen', 
          amount: '₦2,000.00', 
          status: 'Success', 
          date: 'Mar 5, 2026 12:47 PM' 
        },
        { 
          id: 'TRX-16629e3027...', 
          customer: 'Abdussamad salaudeen', 
          amount: '₦2,000.00', 
          status: 'Failed', 
          date: 'Feb 28, 2026 10:41 AM' 
        },
        { 
          id: 'TRX-cccf5e47bd...', 
          customer: 'Abdussamad salaudeen', 
          amount: '₦1,000.00', 
          status: 'Success', 
          date: 'Feb 25, 2026 12:01 PM' 
        },
        { 
          id: 'TRX-ff6ea15e13...', 
          customer: 'Musa Ibrahim', 
          amount: '₦15,500.00', 
          status: 'Pending', 
          date: 'Feb 17, 2026 3:35 PM' 
        },
      ]
    };

    return NextResponse.json(dashboardData, { status: 200 });

  } catch (error) {
    console.error('Dashboard API Error:', error);
    return NextResponse.json({ error: 'Failed to load dashboard data' }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}
