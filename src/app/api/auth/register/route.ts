// src/app/api/auth/register/route.ts
import { NextResponse, type NextRequest } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { hash } from 'bcryptjs';

// In a real app, this would be stored securely and invalidated after use.
const MOCK_OTP_STORE: Record<string, string> = {};

export function setMockOtp(mobile: string, otp: string) {
    MOCK_OTP_STORE[mobile] = otp;
    // OTP is valid for 5 minutes
    setTimeout(() => {
        delete MOCK_OTP_STORE[mobile];
    }, 5 * 60 * 1000);
}

export async function POST(request: NextRequest) {
  try {
    const { 
        firstName, 
        lastName, 
        email, 
        mobile, 
        dob, 
        username, 
        password,
        otp
    } = await request.json();

    if (!firstName || !email || !mobile || !dob || !username || !password || !otp) {
      return NextResponse.json({ message: 'All required fields must be filled' }, { status: 400 });
    }
    
    if (password.length < 6) {
        return NextResponse.json({ message: 'Password must be at least 6 characters long'}, { status: 400})
    }
    
    // --- OTP Verification ---
    const expectedOtp = MOCK_OTP_STORE[mobile];
    if (!expectedOtp || expectedOtp !== otp) {
        return NextResponse.json({ message: 'Invalid or expired OTP' }, { status: 400 });
    }
    // --- End OTP Verification ---

    const { db } = await connectToDatabase();
    
    const existingUser = await db.collection('users').findOne({ $or: [{ username }, { email }, { mobile }] });
    if (existingUser) {
        if (existingUser.username === username) {
            return NextResponse.json({ message: 'Username already exists' }, { status: 409 });
        }
        if (existingUser.email === email) {
            return NextResponse.json({ message: 'Email already exists' }, { status: 409 });
        }
        if (existingUser.mobile === mobile) {
            return NextResponse.json({ message: 'Mobile number already exists' }, { status: 409 });
        }
    }

    const hashedPassword = await hash(password, 12);

    const result = await db.collection('users').insertOne({
      firstName,
      lastName,
      email,
      mobile,
      dob,
      username,
      password: hashedPassword,
      createdAt: new Date(),
    });

    // Clean up OTP after successful registration
    delete MOCK_OTP_STORE[mobile];

    return NextResponse.json({ message: 'User created successfully', userId: result.insertedId }, { status: 201 });

  } catch (error) {
    if (error instanceof SyntaxError) {
      return NextResponse.json({ message: 'Invalid JSON body' }, { status: 400 });
    }
    console.error('Registration error:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
