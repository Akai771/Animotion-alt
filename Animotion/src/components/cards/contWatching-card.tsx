import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Play } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

// Define Props
interface ContWatchingCardProps {
  id: string;
  title: any;
  coverImage: string;
  currentEpisode?: string;
}

const ContWatchingCard: React.FC<ContWatchingCardProps> = ({ id, title, coverImage, currentEpisode }) => {
  const [episode, setEpisode] = useState<string>("");
  const redirectEpisodeId = `${id}-episode-${currentEpisode}`;
  const isMobile = useIsMobile();

  useEffect(() => {
    axios.get(`${import.meta.env.VITE_API}/api/v2/hianime/anime/${id}/episodes`)
      .then((response) => {
        const episodes = response.data.data.episodes;
        const filteredEpisode = episodes.find(
          (episode: { episodeId: string; number: string; title: string }) => episode.episodeId === `${currentEpisode}`
        );
        const episodeTitle = filteredEpisode.number + " - " + filteredEpisode.title;
        setEpisode(episodeTitle);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);
  
  // Mobile version
  if (isMobile) {
    return (
      <Link to={`/watch/${id}?epId=${redirectEpisodeId}`} className="block w-full">
        <Card className="relative overflow-hidden h-20 flex shadow-md hover:shadow-lg hover:bg-red transition-all duration-300 mb-2">
          {/* Left part - Image */}
          <div className="relative w-1/4 min-w-[60px]">
            <img 
              className="w-full h-full object-cover" 
              src={coverImage} 
              alt={title} 
            />
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-300">
              <Play className="text-white" fill="white" size={20} />
            </div>
          </div>
          
          {/* Right part - Content */}
          <div className="flex-1 p-2 flex flex-col justify-between">
            <div>
              <h3 className="font-bold text-xs line-clamp-1">{title}</h3>
              <p className="text-[9px] text-[--secondary-color] mt-0.5">
                Episode {episode}
              </p>
            </div>
            
            {/* Progress bar */}
            <div className="w-full bg-gray-700 h-1 rounded-full overflow-hidden">
              <div className="bg-[--secondary-color] h-full w-1/3" />
            </div>
          </div>
        </Card>
      </Link>
    );
  }

  // Desktop version - original implementation
  return (
    <Card className="group relative flex flex-col items-center justify-center w-80 h-60 rounded-lg transition-all duration-300 hover:bg-[--bgColor3] cursor-pointer hover:shadow-lg">
      <div className="relative w-72 h-40 overflow-hidden rounded-lg">
        <Link to={`/watch/${id}?epId=${redirectEpisodeId}`} className="block w-full h-full">
        <img className=" w-full h-full object-cover transition-all duration-300 group-hover:scale-105 group-hover:blur-sm group-hover:brightness-50" src={coverImage} alt={title} />
          <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-300 hover:opacity-100">
            <Play className="text-white w-12 h-12" fill="white" />
          </div>
        </Link>
      </div>
      <div className="w-72 p-2 flex flex-col items-start text-md">
        <span className="w-full font-bold text-[--text-color] whitespace-nowrap overflow-hidden text-ellipsis">{title}</span>
        <span className="w-full font-medium text-[--secondary-color] text-xs truncate">EP {episode? episode : "No Data"}</span>
      </div>
    </Card>
  );
};

export default ContWatchingCard;