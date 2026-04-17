import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const res = await fetch('https://api.paystack.co/bank?currency=NGN', {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
      },
    });
    
    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch (error) {
    console.error("Paystack Bank Error:", error);
    return NextResponse.json({ error: 'Failed to fetch banks' }, { status: 500 });
  }
}
