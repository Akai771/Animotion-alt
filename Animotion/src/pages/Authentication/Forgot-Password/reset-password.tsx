import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { supabase } from "../../../hooks/supabaseClient";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff } from "lucide-react";

export default function ResetPass() {
  const [passType, setPassType] = useState("password");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setPassword(e.target.value);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    try {
      const { error } = await supabase.auth.updateUser({ password });
      if (error) throw error;
      alert("Password Updated");
      navigate("/signin");
    } catch (error) {
      alert(error);
    }
  }

  function handlePasswordToggle() {
    setPassType((prev) => (prev === "password" ? "text" : "password"));
  }

  return (
    <div className="flex flex-col items-center justify-center fixed inset-0 bg-[--background] overflow-hidden">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader>
          <CardTitle className="text-center text-2xl font-bold">Update Password</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="relative">
              <Label>New Password</Label>
              <Input
                placeholder="Enter New Password"
                type={passType}
                name="password"
                onChange={handleChange}
                required
              />
              <button
                type="button"
                className="absolute right-2 top-9 transform -translate-y-1/2 text-gray-500"
                onClick={handlePasswordToggle}
              >
                {passType === "password" ? <Eye size={18} /> : <EyeOff size={18} />}
              </button>
            </div>

            <Button type="submit" className="w-full">
              Update Password
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
