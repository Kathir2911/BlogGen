
// src/app/api/auth/recovery/send-otp/route.ts
import { NextResponse, type NextRequest } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { setMockOtp } from '../../register/route';

require('dotenv').config()

const twilio = require('twilio');
const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

function generateOtp() {
    return Math.floor(100000 + Math.random() * 900000).toString();
}

export async function POST(request: NextRequest) {
  try {
    const { mobile } = await request.json();

    if (!mobile) {
      return NextResponse.json({ message: 'Mobile number is required' }, { status: 400 });
    }

    if (!/^\+[1-9]\d{1,14}$/.test(mobile)) {
        return NextResponse.json({ message: 'Invalid mobile number format. Expected E.164 format (e.g., +14155552671).' }, { status: 400 });
    }

    const { db } = await connectToDatabase();
    
    // Check if user with this mobile number exists
    const existingUser = await db.collection('users').findOne({ mobile });
    if (!existingUser) {
        return NextResponse.json({ message: 'No account found with this mobile number.' }, { status: 404 });
    }

    const otp = generateOtp();
    setMockOtp(mobile, otp);

    try {
        if (!process.env.TWILIO_PHONE_NUMBER) {
            throw new Error("Twilio phone number is not configured in environment variables.");
        }
        await client.messages.create({
            body: `Your BlogGen recovery code is: ${otp}`,
            from: process.env.TWILIO_PHONE_NUMBER,
            to: mobile
        });
    } catch (smsError: any) {
        console.error('Twilio SMS error:', smsError);
        return NextResponse.json({ message: `Failed to send OTP SMS. ${smsError.message}` }, { status: 500 });
    }

    return NextResponse.json({ message: 'OTP sent successfully for account recovery' }, { status: 200 });

  } catch (error) {
    if (error instanceof SyntaxError) {
      return NextResponse.json({ message: 'Invalid JSON body' }, { status: 400 });
    }
    console.error('Recovery Send OTP error:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
