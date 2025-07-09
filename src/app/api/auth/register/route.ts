// src/app/api/auth/register/route.ts
import { NextResponse, type NextRequest } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { hash } from 'bcryptjs';

export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json();

    if (!username || !password) {
      return NextResponse.json({ message: 'Username and password are required' }, { status: 400 });
    }
    
    if (password.length < 6) {
        return NextResponse.json({ message: 'Password must be at least 6 characters long'}, { status: 400})
    }

    const { db } = await connectToDatabase();
    
    const existingUser = await db.collection('users').findOne({ username });
    if (existingUser) {
      return NextResponse.json({ message: 'Username already exists' }, { status: 409 });
    }

    const hashedPassword = await hash(password, 12);

    const result = await db.collection('users').insertOne({
      username,
      password: hashedPassword,
      createdAt: new Date(),
    });

    return NextResponse.json({ message: 'User created successfully', userId: result.insertedId }, { status: 201 });

  } catch (error) {
    if (error instanceof SyntaxError) {
      return NextResponse.json({ message: 'Invalid JSON body' }, { status: 400 });
    }
    console.error('Registration error:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
