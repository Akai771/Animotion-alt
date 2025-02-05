import React, { useState } from "react";
import { supabase } from "../../../hooks/supabaseClient";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Link } from "react-router-dom";

export default function ForgotPass() {
  const [email, setEmail] = useState("");

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setEmail(e.target.value.trim());
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: "https://animotion-alt.vercel.app/update-password",
      });
      if (error) throw error;
      alert("Check your email for the password reset link");
    } catch (error) {
      alert(error);
    }
  }

  return (
    <div className="flex flex-col items-center justify-center fixed inset-0 bg-[--background] overflow-hidden">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader>
          <CardTitle className="text-center text-2xl font-bold">Reset Password</CardTitle>
          <CardDescription className="text-center text-sm text-gray-500"> Enter the email associated with your account and we'll send you a reset link.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4 mt-1">
            <div>
              <Label>Email Address</Label>
              <Input
                placeholder="Email"
                type="email"
                name="email"
                onChange={handleChange}
                required
              />
            </div>

            <Button type="submit" className="w-full">
              Send Reset Link
            </Button>
          </form>
        </CardContent>
      </Card>
      <span className="text-sm mt-4">
        <Link to="/signin" className="text-[--secondary-color] transition-all duration-300 ease-in-out hover:text-[--secondary-color2]">Back to Login</Link>
      </span>
    </div>
  );
}
