import type { NextRequest } from 'next/server';

// For this demo, we'll use a hardcoded key.
// In a real application, this should be stored securely in environment variables.
const API_KEY = 'my-secret-api-key';

interface AuthResult {
    authenticated: boolean;
    username?: string;
}

export function authenticate(request: NextRequest): AuthResult {
  const authHeader = request.headers.get('Authorization');
  if (!authHeader) {
    return { authenticated: false };
  }

  // Expected format: "Bearer my-secret-api-key:username"
  const [scheme, tokenWithUser] = authHeader.split(' ');
  if (scheme !== 'Bearer' || !tokenWithUser) {
    return { authenticated: false };
  }
  
  const [token, username] = tokenWithUser.split(':');
  
  if (token === API_KEY) {
      return { authenticated: true, username };
  }

  return { authenticated: false };
}
