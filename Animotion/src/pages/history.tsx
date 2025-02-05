import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Trash2 } from "lucide-react";
import DisplayCard from "@/components/cards/display-card";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";

// Define the structure of a history item
interface HistoryItem {
  animeId: string;
  animeTitle: string;
  animeImage: string;
  animeEpisodeId?: string;
}

const History: React.FC = () => {
  const [history, setHistory] = useState<HistoryItem[]>([]);

  // Retrieve history from localStorage
  useEffect(() => {
    const storedHistory = localStorage.getItem("history");
    if (storedHistory) {
      try {
        setHistory(JSON.parse(storedHistory));
      } catch (error) {
        console.error("Error parsing history from localStorage:", error);
      }
    }
    window.scrollTo(0, 0);
  }, []);

  // Clear history function
  const handleHistoryClick = () => {
    localStorage.removeItem("history");
    setHistory([]); // ✅ Updates state instead of reloading the page
  };

  return (
    <div className="flex flex-col items-center justify-center w-full bg-[--background] text-[--text-color] p-5 mt-10">
      <Card className="w-full max-w-[90dvw] h-[90dvh] shadow-lg p-5">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">History</h1>
          {history.length > 0 && (
            <Button variant="destructive" className="flex items-center gap-2" onClick={handleHistoryClick}>
              <Trash2 size={18} />
              Clear History
            </Button>
          )}
        </div>
        <Separator className="my-3"/>

        {history.length > 0 ? ( 
            <ScrollArea className="w-full h-[80vh]">
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-7 gap-4">
                    {history.map((anime) => (
                        <DisplayCard
                            key={anime.animeId}
                            id={anime.animeId}
                            title={anime.animeTitle}
                            coverImage={anime.animeImage}
                            episodeId={anime.animeEpisodeId}
                        />
                        ))}
                </div>
                <ScrollBar orientation="vertical" />
            </ScrollArea>        ) : (
          <p className="text-gray-400 text-sm text-center mt-4">No watch history available.</p>
        )}
      </Card>
    </div>
  );
};

export default History;
