import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "../../hooks/supabaseClient";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { FaGoogle, FaDiscord, FaFacebook } from "react-icons/fa";
import { Eye, EyeOff, Mail, KeyRound  } from "lucide-react";
import Tooltip from "@mui/material/Tooltip";

export default function Login({ setToken }: { setToken: (data: any) => void }) {
  const [passType, setPassType] = useState("password");
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: "", password: "" });

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setFormData((prevFormData) => ({
      ...prevFormData,
      [e.target.name]: e.target.value.trim(),
    }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password,
      });
      if (error) throw error;
      setToken(data);
      navigate("/home");
    } catch (error) {
      alert(error);
    }
  }

  function handlePasswordToggle() {
    setPassType((prev) => (prev === "password" ? "text" : "password"));
  }

//   async function handleOAuthLogin(provider: "google" | "facebook" | "discord") {
//     const { data, error } = await supabase.auth.signInWithOAuth({ provider });
//     if (error) {
//       alert(error.message);
//     }
//   }

  return (
    <div className="flex flex-col items-center justify-center fixed inset-0 bg-[--background] overflow-hidden">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader>
          <CardTitle className="text-left text-2xl font-bold">Welcome back</CardTitle>
          <CardDescription>Login to your account</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label className="flex flex-row gap-2 mb-1 items-center ml-1"><Mail size={17} />Email</Label>
              <Input
                placeholder="m@example.com"
                type="email"
                name="email"
                onChange={handleChange}
                required
              />
            </div>

            <div className="relative">
              <div className="flex flex-row justify-between items-center mb-1">
                <Label className="flex flex-row gap-2 items-center ml-1"><KeyRound size={17} />Password</Label>
                <div className="flex items-center justify-between">
                  <Link to="/forgot-password" className="text-[--secondary-color] transition-all duration-300 ease-in-out hover:text-[--secondary-color2] text-sm">Forgot Password?</Link>
                </div>
              </div>
              <Input
                placeholder="Password"
                type={passType}
                name="password"
                onChange={handleChange}
                required
              />
              <button type="button" className="absolute right-4 top-11 transform -translate-y-1/2 text-gray-500" onClick={handlePasswordToggle} >{passType === "password" ? <Eye size={18} /> : <EyeOff size={18} />}</button>
            </div>
            
            <div className="flex items-center justify-center">
                <Button type="submit" className="w-full">Login</Button>
            </div>
            <div className="flex flex-row items-center justify-center gap-2">
              <div className="border border-t-1 w-2/3"/>
              <span className="w-[9dvw] text-[10px] text-neutral-400">OR CONTINUE WITH</span>
              <div className="border border-t-1 w-2/3"/>
            </div>
            
            <Tooltip title="OAuth Login is disabled for now" placement="bottom" arrow disableInteractive>
            <div className="mt-4 flex flex-row gap-5">
                <Button disabled className="w-1/2 flex items-center justify-center gap-2 bg-neutral-700 hover:bg-gray-800 cursor-not-allowed relative"><FaGoogle size={20} className="text-[--text-color]" /></Button>
                <Button disabled className="w-1/2 flex items-center justify-center gap-2 bg-neutral-700 hover:bg-gray-800 cursor-not-allowed relative"><FaFacebook size={20} className="text-[--text-color]" /></Button>
                <Button disabled className="w-1/2 flex items-center justify-center gap-2 bg-neutral-700 hover:bg-gray-800 cursor-not-allowed relative"><FaDiscord size={20} className="text-[--text-color]" /></Button>
            </div>
          </Tooltip>
          </form>
        </CardContent>
      </Card>
      <div className="flex flex-col items-center justify-center mt-4">
        <span className="text-sm font-normal">Don't have an account?{" "}
            <Link to="/signup" className="text-[--secondary-color] transition-all duration-300 ease-in-out hover:text-[--secondary-color2] font-semibold">Create Account</Link>
        </span>
      </div>
    </div>
  );
}
