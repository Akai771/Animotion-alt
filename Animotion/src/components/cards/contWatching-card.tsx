import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Play } from "lucide-react";

// Define Props
interface ContWatchingCardProps {
  id: string;
  title: any;
  coverImage: string;
  currentEpisode?: string;
}

const ContWatchingCard: React.FC<ContWatchingCardProps> = ({ id, title, coverImage, currentEpisode }) => {
  const redirectEpisodeId = `${id}-episode-${currentEpisode}`;
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/details/${id}`);
  };

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
