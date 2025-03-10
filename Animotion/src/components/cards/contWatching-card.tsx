import React from "react";
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
  const redirectEpisodeId = `${id}-episode-${currentEpisode}`;
  const isMobile = useIsMobile();

  // Mobile version
  if (isMobile) {
    return (
      <Link to={`/watch/${id}?epId=${redirectEpisodeId}`} className="block w-full">
        <Card className="relative overflow-hidden h-20 flex shadow-md hover:shadow-lg transition-all duration-300 mb-2">
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
              <p className="text-[9px] text-[--primary-color] mt-0.5">
                Episode {currentEpisode}
              </p>
            </div>
            
            {/* Progress bar */}
            <div className="w-full bg-gray-700 h-1 rounded-full overflow-hidden">
              <div className="bg-[--primary-color] h-full w-1/3" />
            </div>
          </div>
        </Card>
      </Link>
    );
  }

  // Desktop version - original implementation
  return (
    <Card className="relative flex flex-col items-center justify-center w-80 h-60 rounded-lg transition-all duration-300 hover:bg-[#161616]">
      <div className="relative w-72 h-40 overflow-hidden rounded-lg">
        <Link to={`/watch/${id}?epId=${redirectEpisodeId}`} className="block w-full h-full">
          <img className="w-full h-full object-cover transition-transform duration-300 hover:scale-105 hover:blur-[1.2px]" src={coverImage} alt={title} />
          <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-300 hover:opacity-100">
            <Play className="text-white w-12 h-12" fill="white" />
          </div>
        </Link>
      </div>
      <div className="w-72 p-2 text-center text-md font-bold text-[--text-color] whitespace-nowrap overflow-hidden text-ellipsis">
        {title}
      </div>
    </Card>
  );
};

export default ContWatchingCard;