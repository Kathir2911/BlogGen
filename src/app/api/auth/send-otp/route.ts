// src/app/api/auth/send-otp/route.ts
import { NextResponse, type NextRequest } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { setMockOtp } from '../register/route';

require('dotenv').config()

// In a real app, you would use a library like Twilio to send SMS.
const twilio = require('twilio');
const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

function generateOtp() {
    return Math.floor(100000 + Math.random() * 900000).toString();
}

export async function POST(request: NextRequest) {
  try {
    const { mobile, email, username } = await request.json();

    if (!mobile || !email || !username) {
      return NextResponse.json({ message: 'Mobile, email, and username are required' }, { status: 400 });
    }

    // Basic validation for mobile number format
    if (!/^\+[1-9]\d{1,14}$/.test(mobile)) {
        return NextResponse.json({ message: 'Invalid mobile number format. Expected E.164 format (e.g., +14155552671).' }, { status: 400 });
    }

    const { db } = await connectToDatabase();
    
    // Check registration limit for the mobile number
    const mobileCount = await db.collection('users').countDocuments({ mobile });
    if (mobileCount >= 3) {
      return NextResponse.json({ message: 'This mobile number has reached the maximum number of registrations.' }, { status: 409 });
    }

    // Check if user already exists
    const existingUser = await db.collection('users').findOne({ $or: [{ username }, { email }] });
    if (existingUser) {
        if (existingUser.username === username) {
            return NextResponse.json({ message: 'Username already exists' }, { status: 409 });
        }
        if (existingUser.email === email) {
            return NextResponse.json({ message: 'Email already exists' }, { status: 409 });
        }
    }

    // --- OTP Generation ---
    const otp = generateOtp();
    setMockOtp(mobile, otp);
    // --- End OTP Generation ---

    // --- Real SMS Sending Logic ---
    try {
        if (!process.env.TWILIO_PHONE_NUMBER) {
            throw new Error("Twilio phone number is not configured in environment variables.");
        }
        await client.messages.create({
            body: `Your BlogGen verification code is: ${otp}`,
            from: process.env.TWILIO_PHONE_NUMBER,
            to: mobile
        });
    } catch (smsError: any) {
        console.error('Twilio SMS error:', smsError);
        // Don't expose detailed Twilio errors to the client
        return NextResponse.json({ message: `Failed to send OTP SMS. Please check server configuration. ${smsError.message}` }, { status: 500 });
    }
    // --- End Real SMS Sending ---

    return NextResponse.json({ message: 'OTP sent successfully' }, { status: 200 });

  } catch (error) {
    if (error instanceof SyntaxError) {
      return NextResponse.json({ message: 'Invalid JSON body' }, { status: 400 });
    }
    console.error('Send OTP error:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
