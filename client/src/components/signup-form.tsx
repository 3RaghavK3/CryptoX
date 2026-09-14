import { useState } from "react";
import { Button } from "@/components/ui/button"
import { useNavigate } from "react-router-dom"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp"

export function SignupForm({ ...props }: React.ComponentProps<typeof Card>) {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });
      const data = await res.json();
      
      if (res.ok) {
        setSuccessMsg(data.message || "OTP sent successfully!");
        setStep(2);
      } else {
        setError(data.message || "Failed to sign up");
      }
    } catch (err) {
      setError("Network error. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/signup/verify-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp }),
      });
      const data = await res.json();
      
      if (res.ok) {
        navigate("/login");
      } else {
        setError(data.message || "Invalid OTP");
      }
    } catch (err) {
      setError("Network error. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="bg-[#131d31] border-gray-800 text-white" {...props}>
      <CardHeader>
        <CardTitle>{step === 1 ? "Create an account" : "Verify your Email"}</CardTitle>
        <CardDescription>
          {step === 1 
            ? "Enter your information below to create your account" 
            : `We sent a verification code to ${email}. Please enter it below.`}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {step === 1 ? (
          <form onSubmit={handleSignup}>
            <FieldGroup>
              {error && <div className="text-red-500 text-sm text-center">{error}</div>}
              <Field>
                <FieldLabel htmlFor="name">Full Name</FieldLabel>
                <Input 
                  id="name" 
                  type="text" 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="John Doe" 
                  required 
                />
              </Field>
              <Field>
                <FieldLabel htmlFor="email">Email</FieldLabel>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="m@example.com"
                  required
                />
              </Field>
              <Field>
                <FieldLabel htmlFor="password">Password</FieldLabel>
                <Input 
                  id="password" 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required 
                />
              </Field>
              <Field>
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? "Sending OTP..." : "Create Account"}
                </Button>
                <FieldDescription className="px-6 text-center mt-2">
                  Already have an account? <a href="/login" className="underline text-[#f2d27b]">Sign in</a>
                </FieldDescription>
              </Field>
            </FieldGroup>
          </form>
        ) : (
          <form onSubmit={handleVerifyOtp}>
            <FieldGroup>
              {successMsg && <div className="text-green-500 text-sm text-center mb-2">{successMsg}</div>}
              {error && <div className="text-red-500 text-sm text-center mb-2">{error}</div>}
              <Field>
                <FieldLabel htmlFor="otp">One-Time Password</FieldLabel>
                <InputOTP maxLength={6} value={otp} onChange={setOtp} className="gap-2">
                  <InputOTPGroup>
                    <InputOTPSlot index={0} className="bg-slate-900 border-slate-700" />
                    <InputOTPSlot index={1} className="bg-slate-900 border-slate-700" />
                    <InputOTPSlot index={2} className="bg-slate-900 border-slate-700" />
                    <InputOTPSlot index={3} className="bg-slate-900 border-slate-700" />
                    <InputOTPSlot index={4} className="bg-slate-900 border-slate-700" />
                    <InputOTPSlot index={5} className="bg-slate-900 border-slate-700" />
                  </InputOTPGroup>
                </InputOTP>
              </Field>
              <Field>
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? "Verifying..." : "Verify & Complete Signup"}
                </Button>
                <Button 
                  type="button" 
                  variant="outline" 
                  className="mt-2 text-black"
                  onClick={() => { setStep(1); setError(""); setSuccessMsg(""); }}
                >
                  Back
                </Button>
              </Field>
            </FieldGroup>
          </form>
        )}
      </CardContent>
    </Card>
  )
}
