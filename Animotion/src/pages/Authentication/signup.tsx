import React, { useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../../hooks/supabaseClient";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { FaGoogle, FaDiscord, FaFacebook } from "react-icons/fa";
import { Eye, EyeOff, Mail, KeyRound } from "lucide-react";
import Tooltip from "@mui/material/Tooltip";

export default function Signup() {
  const [formData, setFormData] = useState({
    fname: "",
    lname: "",
    email: "",
    password: "",
  });
  const [passType, setPassType] = useState("password");



  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setFormData((prevFormData) => ({
      ...prevFormData,
      [e.target.name]: e.target.value.trim(),
    }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    try {
      const { data } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          emailRedirectTo: "https://animotion-alt.vercel.app/signin",
          data: {
            fname: formData.fname,
            lname: formData.lname,
          },
        },
      });
      console.error(data)
      alert("Check your email for verification");
    } 
    catch (error) {
      alert(error);
    }
  }

  function handlePasswordToggle() {
    setPassType((prev) => (prev === "password" ? "text" : "password"));
  }

  return (
    <div className="flex flex-col items-center justify-center fixed inset-0 bg-[--background] overflow-hidden">
      <Card className="w-full max-w-md shadow-lg ">
        <CardHeader>
          <CardTitle className="text-center text-2xl font-bold">Sign Up</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>First Name</Label>
                <Input
                  placeholder="First Name"
                  type="text"
                  name="fname"
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <Label>Last Name</Label>
                <Input
                  placeholder="Last Name"
                  type="text"
                  name="lname"
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div>
              <Label className="flex flex-row gap-2 mb-1 items-center ml-1"><Mail size={17} />Email</Label>
              <Input
                placeholder="Email"
                type="email"
                name="email"
                onChange={handleChange}
                required
              />
            </div>

            <div className="relative">
              <Label className="flex flex-row gap-2 mb-1 items-center ml-1"><KeyRound size={17} />Password</Label>
              <Input
                placeholder="Password"
                type={passType}
                name="password"
                onChange={handleChange}
                required
                />
              <button type="button" className="absolute right-4 top-11 transform -translate-y-1/2 text-gray-500" onClick={handlePasswordToggle} >{passType === "password" ? <Eye size={18} /> : <EyeOff size={18} />}</button>
              
              <div className="mt-5 w-full flex flex-col items-center justify-center">
                <Button type="submit" className="w-full">Sign Up</Button>
              </div>
            </div>

            <div className="flex flex-row items-center justify-center gap-2">
              <div className="border border-t-1 w-2/3"/>
              <span className="w-[9dvw] text-[10px] text-neutral-400">OR CONTINUE WITH</span>
              <div className="border border-t-1 w-2/3"/>
            </div>
            

            <Tooltip title="OAuth Login is disabled for now" placement="bottom" arrow disableInteractive>
              <div className="mt-4 flex flex-row gap-5">
                <Button disabled className="w-1/2 flex items-center justify-center gap-2 bg-neutral-700 hover:bg-gray-800 cursor-not-allowed relative"><FaGoogle size={20} className="text-[--secondary-color]" /></Button>
                <Button disabled className="w-1/2 flex items-center justify-center gap-2 bg-neutral-700 hover:bg-gray-800 cursor-not-allowed relative"><FaFacebook size={20} className="text-[--secondary-color]" /></Button>
                <Button disabled className="w-1/2 flex items-center justify-center gap-2 bg-neutral-700 hover:bg-gray-800 cursor-not-allowed relative"><FaDiscord size={20} className="text-[--secondary-color]" /></Button>
              </div>
            </Tooltip>
          </form>
        </CardContent>
      </Card>
      <span className="text-sm mt-3">Already have an account? <Link to="/signin" className="text-[--secondary-color] transition-all duration-300 ease-in-out hover:text-[--secondary-color2] font-semibold">Sign In</Link></span>
    </div>
  );
}
