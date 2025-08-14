// src/app/api/auth/recovery/get-username/route.ts
import { NextResponse, type NextRequest } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { verifyMockOtp } from '@/lib/otp';

export async function POST(request: NextRequest) {
  try {
    const { mobile, otp } = await request.json();

    if (!mobile || !otp) {
      return NextResponse.json({ message: 'Mobile and OTP are required' }, { status: 400 });
    }
    
    // --- OTP Verification ---
    if (!verifyMockOtp(mobile, otp)) {
        return NextResponse.json({ message: 'Invalid or expired OTP' }, { status: 400 });
    }
    // --- End OTP Verification ---

    const { db } = await connectToDatabase();
    
    const user = await db.collection('users').findOne({ mobile });

    if (!user) {
        return NextResponse.json({ message: 'User not found.' }, { status: 404 });
    }

    return NextResponse.json({ username: user.username }, { status: 200 });

  } catch (error) {
    if (error instanceof SyntaxError) {
      return NextResponse.json({ message: 'Invalid JSON body' }, { status: 400 });
    }
    console.error('Get Username error:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
