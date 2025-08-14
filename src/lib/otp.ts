// In a real app, this would be a secure, shared store like Redis or a database table.
// For this demo, we use a simple in-memory object.
const MOCK_OTP_STORE: Record<string, { otp: string; expires: number }> = {};

const OTP_VALIDITY_DURATION = 5 * 60 * 1000; // 5 minutes

/**
 * Sets an OTP for a given mobile number.
 * The OTP will automatically be removed after a set duration.
 * @param mobile - The mobile number (including country code).
 * @param otp - The one-time password.
 */
export function setMockOtp(mobile: string, otp: string): void {
  MOCK_OTP_STORE[mobile] = {
    otp,
    expires: Date.now() + OTP_VALIDITY_DURATION,
  };
}

/**
 * Retrieves the currently valid OTP for a given mobile number.
 * @param mobile - The mobile number.
 * @returns The OTP string or undefined if not found or expired.
 */
export function getMockOtp(mobile: string): string | undefined {
  const entry = MOCK_OTP_STORE[mobile];
  if (entry && Date.now() < entry.expires) {
    return entry.otp;
  }
  // Clean up expired OTP if it's accessed
  if (entry) {
    delete MOCK_OTP_STORE[mobile];
  }
  return undefined;
}

/**
 * Verifies if the provided OTP is correct for the given mobile number.
 * If verification is successful, the OTP is consumed and removed.
 * @param mobile - The mobile number.
 * @param otp - The one-time password to verify.
 * @returns True if the OTP is valid, false otherwise.
 */
export function verifyMockOtp(mobile: string, otp: string): boolean {
    const expectedOtp = getMockOtp(mobile);
    if (expectedOtp && expectedOtp === otp) {
        // OTP is correct, consume it
        delete MOCK_OTP_STORE[mobile];
        return true;
    }
    return false;
}
