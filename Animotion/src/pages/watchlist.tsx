import React, { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { supabase } from "../hooks/supabaseClient";
import DisplayCard from "@/components/cards/display-card";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";

// Define types for watchlist item
interface WatchlistItem {
  animeId: string;
  animeTitle: string;
  animeImage: string;
}

const Watchlist: React.FC = () => {
  const [watchlist, setWatchlist] = useState<WatchlistItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Retrieve user ID from localStorage safely
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

  // Fetch watchlist from Supabase
  useEffect(() => {
    if (userId) {
      getWatchlist();
    }
    window.scrollTo(0, 0);
  }, [userId]);

  async function getWatchlist() {
    setLoading(true);
    const { data, error } = await supabase.from("watchlistAnimotion_alt").select().eq("userID", userId);
    if (error) {
      console.error("Error fetching watchlist:", error);
    } else {
      setWatchlist(data || []);
    }
    setLoading(false);
  }

  return (
    <div className="flex flex-col items-center justify-center w-full bg-[--background] text-[--text-color] p-5 mt-10">
      <Card className="w-full max-w-[90dvw] h-[90dvh] shadow-lg p-5">
        <span className="text-2xl font-bold text-left mb-5">Watchlist</span>
        <Separator className="my-3"/>

        {loading ? (
          <p className="text-gray-400 text-sm text-center mt-4">Loading...</p>
        ) : watchlist.length > 0 ? (
        <ScrollArea className="w-full h-[80vh]">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-7 gap-4">
            {watchlist.map((anime) => (
              <DisplayCard key={anime.animeId} id={anime.animeId} title={anime.animeTitle} coverImage={anime.animeImage} />
            ))}
          </div>
          <ScrollBar orientation="vertical" />
        </ScrollArea>
        ) : (
          <p className="text-gray-400 text-sm text-center mt-4">Your watchlist is empty.</p>
        )}
      </Card>
    </div>
  );
};

export default Watchlist;
