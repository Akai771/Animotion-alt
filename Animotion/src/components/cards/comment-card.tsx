import React, { useEffect, useState } from "react";
import { Avatar } from "@mui/material";
import { supabase } from "../../hooks/supabaseClient";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

// Define props type
interface CommentCardProps {
  comment: string;
  user: string;
  userID: string;
  date: string;
  onCommentDelete: () => void;
  pfp?: string | null;
}

const CommentCard: React.FC<CommentCardProps> = ({ comment, user, userID, date, onCommentDelete, pfp }) => {
  const token = localStorage.getItem("token");
  let userId = "";

  // Retrieve user ID from localStorage
  if (token) {
    try {
      const tokenData = JSON.parse(token);
      userId = tokenData?.user?.id || "";
    } catch (error) {
      console.error("Error parsing token data", error);
    }
  }

  const [commentDisplay, setCommentDisplay] = useState(false);

  useEffect(() => {
    setCommentDisplay(userId === userID);
  }, [userId, userID]);

  // Ensure default user name
  const displayUser = user === "undefined undefined" ? "Anonymous" : user;

  // Delete comment from database
  async function deleteComment() {
    try {
      const { error } = await supabase.from("comments_alt").delete().eq("comment", comment);
      if (error) {
        console.error("Error deleting comment:", error);
      } else {
        console.log("Comment deleted successfully");
        onCommentDelete();
      }
    } catch (error) {
      console.error("Unexpected error while deleting comment:", error);
    }
  }

  return (
    <Card className="p-4 flex flex-col gap-2 w-full border border-neutral-700 shadow-md" style={{ backgroundColor: commentDisplay?"var(--bgColor)":"var(--bgColor2)" }}>
      <div className="flex items-center justify-between gap-3">
        <div className="flex flex-row items-center gap-2">
            <Avatar alt="User Avatar" src={pfp || undefined} />
            <div className="flex flex-col">
                <span className="text-sm font-bold">{displayUser}</span>
                <span className="text-xs text-gray-400">{date}</span>
            </div>
        </div>
        {commentDisplay && (
        <Button variant="destructive" className="w-1 flex items-center gap-2" onClick={deleteComment}>
          <Trash2 size={16} />
        </Button>
      )}
      </div>

      <div className="mt-2">
        <p className="text-sm text-gray-200">{comment}</p>
      </div>
    </Card>
  );
};

export default CommentCard;
