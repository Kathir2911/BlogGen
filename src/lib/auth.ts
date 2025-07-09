import type { NextRequest } from 'next/server';

// For this demo, we'll use a hardcoded key.
// In a real application, this should be stored securely in environment variables.
const API_KEY = 'my-secret-api-key';

export function authenticate(request: NextRequest): boolean {
  const authHeader = request.headers.get('Authorization');
  if (!authHeader) {
    return false;
  }

  const token = authHeader.split(' ')[1];
  return token === API_KEY;
}
