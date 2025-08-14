// src/app/api/auth/recovery/reset-password/route.ts
import { NextResponse, type NextRequest } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { hash } from 'bcryptjs';
import { verifyMockOtp } from '@/lib/otp';


export async function POST(request: NextRequest) {
  try {
    const { mobile, otp, newPassword } = await request.json();

    if (!mobile || !otp || !newPassword) {
      return NextResponse.json({ message: 'Mobile, OTP, and new password are required' }, { status: 400 });
    }
    
    if (newPassword.length < 6) {
        return NextResponse.json({ message: 'Password must be at least 6 characters long'}, { status: 400})
    }
    
    // --- OTP Verification ---
    if (!verifyMockOtp(mobile, otp)) {
        return NextResponse.json({ message: 'Invalid or expired OTP' }, { status: 400 });
    }
    // --- End OTP Verification ---

    const { db } = await connectToDatabase();
    
    const hashedPassword = await hash(newPassword, 12);

    const result = await db.collection('users').updateOne(
      { mobile },
      { $set: { password: hashedPassword } }
    );
    
    if (result.matchedCount === 0) {
        return NextResponse.json({ message: 'User not found.' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Password reset successfully' }, { status: 200 });

  } catch (error) {
    if (error instanceof SyntaxError) {
      return NextResponse.json({ message: 'Invalid JSON body' }, { status: 400 });
    }
    console.error('Reset Password error:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
