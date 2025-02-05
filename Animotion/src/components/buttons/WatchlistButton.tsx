import React, { useState, useEffect } from "react";
import { supabase } from "../../hooks/supabaseClient";
import { Button } from "@/components/ui/button";
import { CheckCircle, Plus } from "lucide-react";

// Define Props
interface WatchlistButtonProps {
  animeId: string;
  animeTitle: string;
  animeImage: string;
}

const WatchlistButton: React.FC<WatchlistButtonProps> = ({ animeId, animeTitle, animeImage }) => {
  const [isWatchlist, setIsWatchlist] = useState(false);
  const [watchlist, setWatchlist] = useState<{ animeId: string }[]>([]);
  const [buttonText, setButtonText] = useState<JSX.Element>(<>Watchlist <Plus size={16} /></>);

  // Get user ID from local storage safely
  const token = localStorage.getItem("token");
  let userId = "";

  if (token) {
    try {
      const tokenData = JSON.parse(token);
      userId = tokenData?.user?.id || "";
    } catch (error) {
      console.error("Error parsing token data:", error);
    }
  }

  // Fetch user's watchlist from Supabase
  useEffect(() => {
    if (userId) {
      getWatchlist();
    }
  }, [userId]);

  async function getWatchlist() {
    const { data, error } = await supabase
      .from("watchlistAnimotion_alt")
      .select("animeId")
      .eq("userID", userId);

    if (error) {
      console.error("Error fetching watchlist:", error);
    } else {
      setWatchlist(data || []);
    }
  }

  // Check if anime is in watchlist
  useEffect(() => {
    const isInWatchlist = watchlist.some((anime) => anime.animeId === animeId);
    setIsWatchlist(isInWatchlist);
    setButtonText(
      isInWatchlist ? (
        <>Watchlist <CheckCircle size={16} /></>
      ) : (
        <>Watchlist <Plus size={16} /></>
      )
    );
  }, [watchlist, animeId]);

  // Handle Watchlist Addition/Removal
  const handleAddToWatchlist = async () => {
    if (!userId) return;

    if (isWatchlist) {
      // Remove from watchlist
      const { error } = await supabase
        .from("watchlistAnimotion_alt")
        .delete()
        .match({ animeId: animeId, userID: userId });

      if (error) {
        console.error("Error removing from watchlist:", error);
      } else {
        console.log("Removed from watchlist");
        setWatchlist((prev) => prev.filter((anime) => anime.animeId !== animeId));
      }
    } else {
      // Add to watchlist
      const { error } = await supabase.from("watchlistAnimotion_alt").insert([
        {
          animeId: animeId,
          animeTitle: animeTitle,
          animeImage: animeImage,
          userID: userId,
        },
      ]);

      if (error) {
        console.error("Error adding to watchlist:", error);
      } else {
        console.log("Added to watchlist");
        setWatchlist((prev) => [...prev, { animeId }]);
      }
    }
  };

  return (
    <Button
      variant={isWatchlist ? "default" : "outline"}
      className="mt-2 px-4 py-2"
      onClick={handleAddToWatchlist}
    >
      {buttonText}
    </Button>
  );
};

export default WatchlistButton;
