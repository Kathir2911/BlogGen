// src/app/register/page.tsx
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

export default function RegisterPage() {
  const [step, setStep] = useState<'details' | 'otp'>('details');
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [countryCode, setCountryCode] = useState("+1");
  const [mobile, setMobile] = useState("");
  const [dob, setDob] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const handleRequestOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (!firstName || !email || !mobile || !dob || !username || !password) {
      toast({
        variant: "destructive",
        title: "Missing Fields",
        description: "Please fill out all required fields.",
      });
      setLoading(false);
      return;
    }

    try {
      const fullMobile = `${countryCode}${mobile}`;
      const res = await fetch("/api/auth/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mobile: fullMobile, email, username }),
      });

      const data = await res.json();

      if (res.ok) {
        toast({
          title: "OTP Sent",
          description: `An OTP has been sent to your mobile number. Please enter it to complete registration.`,
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

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (!otp) {
        toast({ variant: "destructive", title: "Missing OTP", description: "Please enter the OTP." });
        setLoading(false);
        return;
    }

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName,
          lastName,
          email,
          mobile: `${countryCode}${mobile}`,
          dob,
          username,
          password,
          otp
        }),
      });

      const data = await res.json();

      if (res.ok) {
        toast({
          title: "Registration Successful",
          description: "You can now log in with your new account.",
        });
        router.push("/login");
      } else {
        toast({
          variant: "destructive",
          title: "Registration Failed",
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
          <CardTitle className="text-2xl">Register</CardTitle>
          <CardDescription>
            {step === 'details' ? 'Create a new account to start posting.' : 'Enter the OTP sent to your mobile.'}
          </CardDescription>
        </CardHeader>
        {step === 'details' ? (
          <form onSubmit={handleRequestOtp}>
            <CardContent className="grid gap-4">
              <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                      <Label htmlFor="firstName">First Name</Label>
                      <Input id="firstName" placeholder="John" required value={firstName} onChange={(e) => setFirstName(e.target.value)} />
                  </div>
                  <div className="grid gap-2">
                      <Label htmlFor="lastName">Last Name (Optional)</Label>
                      <Input id="lastName" placeholder="Doe" value={lastName} onChange={(e) => setLastName(e.target.value)} />
                  </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  type="text"
                  placeholder="Choose a username"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" placeholder="m@example.com" required value={email} onChange={(e) => setEmail(e.target.value)} />
              </div>
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
              <div className="grid gap-2">
                <Label htmlFor="dob">Date of Birth</Label>
                <Input id="dob" type="date" required value={dob} onChange={(e) => setDob(e.target.value)} />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Choose a password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </CardContent>
            <CardFooter className="flex flex-col">
              <Button className="w-full" type="submit" disabled={loading}>
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Send OTP
              </Button>
              <p className="mt-4 text-xs text-center text-muted-foreground">
                Already have an account?{' '}
                <Link href="/login" className="text-primary hover:underline">
                  Sign in
                </Link>
              </p>
            </CardFooter>
          </form>
        ) : (
          <form onSubmit={handleRegister}>
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
                    Verify & Register
                </Button>
                <Button variant="link" size="sm" className="mt-2" onClick={() => setStep('details')}>Back to details</Button>
            </CardFooter>
          </form>
        )}
      </Card>
    </div>
  );
}
