import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Button } from "@/components/ui/button";

// Define props for the component
interface WatchNowButtonProps {
  animeId: string;
  animeTitle: string;
  animeImage: string;
  animeEpisode: string;
}

const WatchNowButton: React.FC<WatchNowButtonProps> = ({ animeId, animeTitle, animeImage, animeEpisode }) => {
  const navigate = useNavigate();
  const [history, setHistory] = useState<{ animeId: string; animeTitle: string; animeImage: string }[]>([]);

  // Load watch history from localStorage on component mount
  useEffect(() => {
    const storedHistory = localStorage.getItem("history");
    if (storedHistory) {
      try {
        setHistory(JSON.parse(storedHistory));
      } catch (error) {
        console.error("Error parsing history from localStorage:", error);
      }
    }
  }, []);

  // Handle Watch Now button click
  const handleWatchButton = () => {
    if (!animeId) return;

    // Check if anime already exists in history
    const existingHistoryIndex = history.findIndex((anime) => anime.animeId === animeId);

    if (existingHistoryIndex === -1) {
      // Update history if not already present
      const updatedHistory = [...history, { animeId, animeTitle, animeImage }];
      setHistory(updatedHistory);
      localStorage.setItem("history", JSON.stringify(updatedHistory));
    }

    // Navigate to the watch page
    navigate(`/watch/${animeId}?epId=${animeEpisode}`);
  };

  return (
    <Button variant="default" className="mt-2 px-4 py-2 bg-[--primary-color] text-[--text-color] transition-all duration-300 ease-in-out hover:bg-[--primary-color2]" onClick={handleWatchButton}>Watch Now</Button>
  );
};

export default WatchNowButton;
