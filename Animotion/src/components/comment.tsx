import React, { useState, useEffect } from "react";
import CommentCard from "./cards/comment-card";
import { supabase } from "../hooks/supabaseClient";
import moment from "moment";
import { Textarea } from "./ui/textarea";
import { Button } from "./ui/button";
import { Separator } from "./ui/separator";
import { ScrollArea, ScrollBar } from "./ui/scroll-area";
import { Send } from  "lucide-react"

// Define types for props & comment data
interface CommentProps {
  animeId: string;
}

interface CommentType {
  id: string;
  animeID: string;
  userId: string;
  userName: string;
  comment: string;
  created_date: string;
  userPfp: string | null;
}

const Comment: React.FC<CommentProps> = ({ animeId }) => {
  const [comments, setComments] = useState<CommentType[]>([]);

  // Retrieve token safely
  const token = localStorage.getItem("token");
  let userId = "";
  let userName = "";
  let userPfp = localStorage.getItem("pfp") || "";

  if (token) {
    try {
      const tokenData = JSON.parse(token);
      userId = tokenData?.user?.id || "";
      userName = `${tokenData?.user?.user_metadata?.fname || "User"} ${
        tokenData?.user?.user_metadata?.lname || ""
      }`;
    } catch (error) {
      console.error("Error parsing token data", error);
    }
  }

  const formattedDate = moment().format("YYYY/MM/DD");

  // Handle the comment form submission
  const handleComment = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const comment = (e.currentTarget[0] as HTMLTextAreaElement).value;
    if (comment.trim() !== "") {
      postComment(comment);
      e.currentTarget.reset();
    }
  };

  // Post comment to the database
  async function postComment(comment: string) {
    const { error } = await supabase.from("comments_alt").insert([
      {
        animeID: animeId,
        userId: userId,
        userName: userName,
        comment: comment,
        created_date: formattedDate,
        userPfp: userPfp,
      },
    ]);
    if (error) {
      console.error("Error posting comment: ", error);
    } else {
      getComments();
    }
  }

  // Fetch comments from the database
  useEffect(() => {
    getComments();
  }, []);

  async function getComments() {
    const { data, error } = await supabase.from("comments_alt").select();
    if (error) {
      console.error("Error fetching comments:", error);
      return;
    }
    const userData = data?.filter((comment: CommentType) => comment.animeID === animeId) || [];
    setComments(userData);
  }

  return (
    <div className="w-full mt-2">
      <form className="mb-5" onSubmit={handleComment}>
        <div className="grid w-full gap-2">
            <Textarea placeholder="Add a public comment...." />
            <Button className="w-44"><Send/>Send message</Button>
        </div>
      </form>
      <Separator />
      <ScrollArea className="mt-5 max-h-[100dvh]" >
        <div className="mt-5">
            {comments.length > 0 ? (
            comments.map((anime) => (
                <div className="mt-2" key={anime.id}>
                    <CommentCard
                    key={anime.id}
                    user={anime.userName}
                    comment={anime.comment}
                    date={anime.created_date}
                    userID={anime.userId}
                    onCommentDelete={getComments}
                    pfp={anime.userPfp}
                    />
                </div>
            ))
            ) : (
            <p className="text-neutral-400 text-sm mt-4">No comments yet. Be the first to comment!</p>
            )}
        </div>
      <ScrollBar orientation="vertical" />
      </ScrollArea>
    </div>
  );
};

export default Comment;
