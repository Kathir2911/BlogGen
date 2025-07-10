
// src/app/forgot-username/page.tsx
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
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export default function ForgotUsernamePage() {
  const [step, setStep] = useState<'details' | 'otp' | 'result'>('details');
  const [countryCode, setCountryCode] = useState("+1");
  const [mobile, setMobile] = useState("");
  const [otp, setOtp] = useState("");
  const [retrievedUsername, setRetrievedUsername] = useState("");
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

  const handleRetrieveUsername = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (!otp) {
        toast({ variant: "destructive", title: "Missing OTP", description: "Please enter the OTP." });
        setLoading(false);
        return;
    }

    try {
      const res = await fetch("/api/auth/recovery/get-username", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mobile: `${countryCode}${mobile}`,
          otp
        }),
      });

      const data = await res.json();

      if (res.ok) {
        setRetrievedUsername(data.username);
        setStep('result');
      } else {
        toast({
          variant: "destructive",
          title: "Failed to retrieve username",
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
  
  const renderContent = () => {
    switch(step) {
      case 'details':
        return (
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
        );
      case 'otp':
        return (
          <form onSubmit={handleRetrieveUsername}>
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
            </CardContent>
             <CardFooter className="flex flex-col">
                <Button className="w-full" type="submit" disabled={loading}>
                    {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Retrieve Username
                </Button>
                <Button variant="link" size="sm" className="mt-2" onClick={() => setStep('details')}>Back</Button>
            </CardFooter>
          </form>
        );
      case 'result':
        return (
            <>
                <CardContent>
                    <Alert>
                        <AlertTitle>Your Username</AlertTitle>
                        <AlertDescription className="font-bold text-lg text-center pt-2">
                            {retrievedUsername}
                        </AlertDescription>
                    </Alert>
                </CardContent>
                <CardFooter>
                    <Button className="w-full" onClick={() => router.push('/login')}>
                        Back to Login
                    </Button>
                </CardFooter>
            </>
        )
    }
  }


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
          <CardTitle className="text-2xl">Forgot Username</CardTitle>
          <CardDescription>
            {step === 'details' && 'Enter your mobile number to retrieve your username.'}
            {step === 'otp' && 'Enter the OTP sent to your mobile.'}
            {step === 'result' && 'Your username is shown below.'}
          </CardDescription>
        </CardHeader>
        {renderContent()}
      </Card>
    </div>
  );
}
