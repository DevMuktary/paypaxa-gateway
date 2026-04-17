import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const accountNumber = searchParams.get('account_number');
    const bankCode = searchParams.get('bank_code');

    if (!accountNumber || !bankCode) {
      return NextResponse.json({ error: 'Missing account parameters' }, { status: 400 });
    }

    const res = await fetch(`https://api.paystack.co/bank/resolve?account_number=${accountNumber}&bank_code=${bankCode}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
      },
    });

    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch (error) {
    console.error("Paystack Resolve Error:", error);
    return NextResponse.json({ error: 'Failed to resolve account' }, { status: 500 });
  }
}
