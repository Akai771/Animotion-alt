import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../hooks/supabaseClient";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import Avatar from '@mui/material/Avatar';
import axios from "axios";

interface ProfileProps {
  token: any;
}

const useAnimePFP = () => {
  const [pfp, setPfp] = useState<string>("https://via.placeholder.com/150");

  const getGif = async () => {
    try {
      const response = await axios.get("https://any-anime.p.rapidapi.com/v1/anime/gif/1", {
        headers: {
          "X-RapidAPI-Key": "1277aeaf7cmsh0fa4d916bceb446p1740a1jsn9d611343e42c",
          "X-RapidAPI-Host": "any-anime.p.rapidapi.com",
        },
      });
      const gifUrl = response.data.images?.[0];
      if (gifUrl) {
        setPfp(gifUrl);
        localStorage.setItem("pfp", gifUrl);
      }
    } catch (error) {
      console.error("Error fetching PFP:", error);
    }
  };

  useEffect(() => {
    const storedPfp = localStorage.getItem("pfp");
    if (storedPfp) {
      setPfp(storedPfp);
    } else {
      getGif();
    }
  }, []);

  return { pfp, getGif };
};

const Profile: React.FC<ProfileProps> = ({ token }) => {
  const user = token ? token.user.user_metadata : { fname: "No", lname: "Data" };
  const name = `${user.fname} ${user.lname}`;
  const email = token ? token.user.email : "No Data";
  const { pfp, getGif } = useAnimePFP();

  const [pass, setPass] = useState<string>("");
  const [confPass, setConfPass] = useState<string>("");
  const [changeEmail, setChangeEmail] = useState<string>("");
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleChangePass = async () => {
    if (pass === confPass) {
      const { error } = await supabase.auth.updateUser({ password: pass });
      if (error) return alert(error.message);
      alert("Password Changed Successfully");
    } else {
      alert("Passwords do not match");
    }
  };

  const handleChangeEmailButton = async () => {
    try {
      const { error } = await supabase.auth.updateUser({ email: changeEmail });
      if (error) return alert(error.message);
      alert("Email Changed Successfully");
    } catch (error) {
      alert(error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/signin");
  };

  return (
    <>
      <div className="w-full flex flex-col items-center p-6 mt-10">
        <Card className="w-full max-w-2xl p-6">
          <h1 className="text-3xl font-bold">My Account</h1>
        </Card>

        {/* User Information */}
        <Card className="w-full max-w-2xl p-6 mt-6">
          <h2 className="text-2xl font-bold">User Information</h2>
          <Separator className="my-4" />
          <div className="space-y-4">
            <div className="w-full flex flex-col items-center justify-center gap-3">
              <Avatar src={pfp} sx={{ width: 100, height: 100 }} />
              <Button variant="secondary" onClick={getGif}>Randomize PFP</Button>
            </div>
            <div>
              <Label>Full Name</Label>
              <Input value={name} disabled />
            </div>
            <div>
              <Label>Email Address</Label>
              <Input value={email} disabled />
            </div>
          </div>
        </Card>

        {/* Change Email */}
        <Card className="w-full max-w-2xl p-6 mt-6">
          <h2 className="text-2xl font-bold">Change Email Address</h2>
          <p className="text-neutral-500 text-sm">You can change email once per month.</p>
          <Separator className="my-4" />
          <div className="space-y-4 mt-4">
            <Label>Email Address</Label>
            <Input type="email" placeholder="Enter New Email Address" onChange={(e) => setChangeEmail(e.target.value)} />
            <Button onClick={handleChangeEmailButton}>Change Email</Button>
          </div>
        </Card>

        {/* Change Password */}
        <Card className="w-full max-w-2xl p-6 mt-6">
          <h2 className="text-2xl font-bold">Change Password</h2>
          <p className="text-neutral-500 text-sm">Password should be at least 6 characters.</p>
          <Separator className="my-4" />
          <div className="space-y-4 mt-4">
            <Label>New Password</Label>
            <Input type="password" placeholder="Enter New Password" onChange={(e) => setPass(e.target.value)} />
            <Label>Confirm Password</Label>
            <Input type="password" placeholder="Confirm New Password" onChange={(e) => setConfPass(e.target.value)} />
            <Button onClick={handleChangePass}>Change Password</Button>
          </div>
        </Card>

        {/* Logout */}
        <Card className="w-full max-w-2xl p-6 mt-6">
          <h2 className="text-2xl font-bold">Log Out</h2>
          <p className="text-neutral-500 text-sm">Back to the real world!</p>
          <Separator className="my-4" />
          <Button variant="destructive" className="mt-4 w-full" onClick={handleLogout}>
            Log Out
          </Button>
        </Card>
      </div>
    </>
  );
};

export default Profile;
