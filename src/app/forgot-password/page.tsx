
// src/app/forgot-password/page.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import Link from "next/link";
import { Loader2, Newspaper } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function ForgotPasswordPage() {
  const [step, setStep] = useState<'details' | 'otp'>('details');
  const [countryCode, setCountryCode] = useState("+1");
  const [mobile, setMobile] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const handleRequestOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (!mobile) {
      toast({ variant: "destructive", title: "Missing Field", description: "Please enter your mobile number." });
      setLoading(false);
      return;
    }

    try {
      const fullMobile = `${countryCode}${mobile}`;
      const res = await fetch("/api/auth/recovery/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mobile: fullMobile }),
      });

      const data = await res.json();

      if (res.ok) {
        toast({
          title: "OTP Sent",
          description: `An OTP has been sent to your mobile number.`,
        });
        setStep('otp');
      } else {
        toast({
          variant: "destructive",
          title: "Failed to send OTP",
          description: data.message || "An unknown error occurred.",
        });
      }
    } catch (error) {
       toast({
        variant: "destructive",
        title: "Error",
        description: "Could not connect to the server.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (!otp || !newPassword) {
        toast({ variant: "destructive", title: "Missing Fields", description: "Please enter the OTP and a new password." });
        setLoading(false);
        return;
    }
    
    if (newPassword.length < 6) {
        toast({ variant: "destructive", title: "Password Too Short", description: "Password must be at least 6 characters long." });
        setLoading(false);
        return;
    }

    try {
      const res = await fetch("/api/auth/recovery/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mobile: `${countryCode}${mobile}`,
          otp,
          newPassword
        }),
      });

      const data = await res.json();

      if (res.ok) {
        toast({
          title: "Password Reset Successful",
          description: "You can now log in with your new password.",
        });
        router.push("/login");
      } else {
        toast({
          variant: "destructive",
          title: "Reset Failed",
          description: data.message || "An unknown error occurred.",
        });
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Could not connect to the server.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background p-4">
       <div className="mb-6">
        <Link href="/" className="flex items-center gap-2 text-foreground">
            <Newspaper className="h-7 w-7 text-primary" />
            <span className="text-2xl font-bold font-headline text-primary">BlogGen</span>
        </Link>
      </div>
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle className="text-2xl">Forgot Password</CardTitle>
          <CardDescription>
            {step === 'details' ? 'Enter your mobile number to receive a reset code.' : 'Enter the OTP and your new password.'}
          </CardDescription>
        </CardHeader>
        {step === 'details' ? (
          <form onSubmit={handleRequestOtp}>
            <CardContent className="grid gap-4">
                <div className="grid gap-2">
                    <Label htmlFor="mobile">Mobile Number</Label>
                    <div className="flex gap-2">
                        <Select value={countryCode} onValueChange={setCountryCode}>
                            <SelectTrigger className="w-[80px]">
                                <SelectValue placeholder="Code" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="+1">+1</SelectItem>
                                <SelectItem value="+44">+44</SelectItem>
                                <SelectItem value="+91">+91</SelectItem>
                            </SelectContent>
                        </Select>
                        <Input id="mobile" type="tel" placeholder="123-456-7890" required value={mobile} onChange={(e) => setMobile(e.target.value)} className="flex-1" />
                    </div>
                </div>
            </CardContent>
            <CardFooter className="flex flex-col">
              <Button className="w-full" type="submit" disabled={loading}>
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Send OTP
              </Button>
               <Button variant="link" size="sm" className="mt-2" onClick={() => router.push('/login')}>Back to login</Button>
            </CardFooter>
          </form>
        ) : (
          <form onSubmit={handleResetPassword}>
            <CardContent className="grid gap-4">
                <div className="grid gap-2">
                    <Label htmlFor="otp">OTP</Label>
                    <Input 
                        id="otp" 
                        type="text" 
                        placeholder="Enter 6-digit OTP" 
                        required 
                        value={otp} 
                        onChange={(e) => setOtp(e.target.value)} 
                        maxLength={6}
                    />
                </div>
                <div className="grid gap-2">
                    <Label htmlFor="newPassword">New Password</Label>
                    <Input 
                        id="newPassword" 
                        type="password" 
                        placeholder="Choose a new password" 
                        required 
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                    />
                </div>
            </CardContent>
             <CardFooter className="flex flex-col">
                <Button className="w-full" type="submit" disabled={loading}>
                    {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Reset Password
                </Button>
                <Button variant="link" size="sm" className="mt-2" onClick={() => setStep('details')}>Back</Button>
            </CardFooter>
          </form>
        )}
      </Card>
    </div>
  );
}
