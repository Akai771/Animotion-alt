import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Play, Star, Mic, Captions } from "lucide-react";
import Tooltip from "@mui/material/Tooltip";
import { useIsMobile } from "@/hooks/use-mobile";

type DisplayCardProps = {
  id: any;
  title: any;
  coverImage: any;
  type?: any;
  duration?: any;
  currentEpisode?: any;
  currentText?: any;
  episodeId?: any;
};

const DisplayCard: React.FC<DisplayCardProps> = ({ id, title, coverImage, currentEpisode, type, duration, currentText }) => {
  const [qtipData, setQtipData] = useState<any>({});
  const isMobile = useIsMobile();

  useEffect(() => {
    if (!isMobile) {
      axios
        .get(`${import.meta.env.VITE_API}/api/v2/hianime/qtip/${id}`)
        .then((res) => {
          setQtipData(res.data.data.anime);
        })
        .catch((err) => {
          console.error("Error fetching Qtip Data: ", err);
        });
    }
  }, [id, isMobile]);

  const episodeSub = qtipData?.episodes?.sub || "N/A";
  const episodeDub = qtipData?.episodes?.dub || "N/A";
  const genres = qtipData?.genres || [];

  // Mobile version
  if (isMobile) {
    return (
      <div className="mb-2">
        <Link to={`/details/${id}`} className="block">
          <Card className="overflow-hidden rounded-md shadow-sm relative">
            {/* Main image */}
            <div className="relative aspect-[2/3]">
              <img 
                src={coverImage} 
                alt={title} 
                className="w-full h-full object-cover"
              />
              
              {/* Overlay for hover effect */}
              <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                <Play size={30} className="text-white" fill="white" />
              </div>
              
              {/* Tags overlay */}
              <div className="absolute top-1 left-1 flex flex-wrap gap-1">
                {type && (
                  <Badge className="text-[8px] px-1.5 py-0 rounded-sm bg-red-500 text-white">
                    {type}
                  </Badge>
                )}
                {duration && (
                  <Badge className="text-[8px] px-1.5 py-0 rounded-sm bg-[--primary-color] text-white">
                    {duration}
                  </Badge>
                )}
              </div>
            </div>
            
            {/* Title and info */}
            <div className="p-1">
              <h3 className="text-xs font-medium line-clamp-1 mb-0.5">{title}</h3>
              {currentEpisode && (
                <p className="text-[10px] text-gray-400">
                  {currentText} {currentEpisode}
                </p>
              )}
            </div>
          </Card>
        </Link>
      </div>
    );
  }

  // Desktop version with Tailwind
  return (
    <Tooltip title={
        <div className="flex flex-col p-1">
            <span className="text-xl font-bold mb-1">{qtipData.name}</span>
            <div className="flex flex-row gap-[.2rem] mb-4">
                <Badge className="text-xs rounded-lg bg-[#f0c929] gap-1"><Star size={15} fill="black"/>{qtipData?.malscore}</Badge>
                <Badge className="text-xs rounded-lg dark:bg-[--primary-color] dark:text-[--text-color] gap-1">{qtipData?.type}</Badge>
                <Badge className="text-xs rounded-lg dark:bg-[--primary-color] dark:text-[--text-color] gap-1"><Captions size={15} />{episodeSub}</Badge>
                <Badge className="text-xs rounded-lg dark:bg-[--primary-color] dark:text-[--text-color] gap-1"><Mic size={15} />{episodeDub}</Badge>
            </div>
            <div className="flex flex-col gap-1">
                <span className="text-sm dark:text-[--secondary-color] font-semibold">Jname:  <span className="text-xs text-[--text-color] font-normal">{qtipData.jname?qtipData.jname:"N/A"} </span></span>
                <span className="text-sm dark:text-[--secondary-color] font-semibold">Genres: <span className="text-xs text-[--text-color] font-normal">{genres.join(", ")} </span></span>
                <span className="text-sm dark:text-[--secondary-color] font-semibold">Aired: <span className="text-xs text-[--text-color] font-normal">{qtipData.aired} </span></span>
                <span className="text-sm dark:text-[--secondary-color] font-semibold">Status: <span className="text-xs text-[--text-color] font-normal">{qtipData.status} </span></span>
                <span className="text-sm dark:text-[--secondary-color] font-semibold">Desc: <span className="text-xs text-[--text-color] font-normal">{qtipData.description? qtipData.description: "N/A"} </span></span>
            </div>
        </div>
    } placement="right" arrow disableInteractive>
        <Card className="group flex flex-col w-56 max-h-96 p-3 bg-[--bgColor2] text-white relative overflow-visible transition-transform duration-500 ease-in-out cursor-pointer">
            <Link to={`/details/${id}`}>
                <div className="relative w-50 h-72 overflow-hidden rounded-md">
                    <img 
                        className="w-full h-72 object-cover hover:opacity-50 hover:blur-sm transition-all duration-500 ease-in-out group-hover:scale-105 group-hover:blur-sm group-hover:brightness-50" 
                        src={coverImage} 
                        alt={title} 
                    />
                    <div className="absolute top-4 left-3 flex flex-row gap-1.5 transition-all duration-500 ease-in-out ">
                        {type && (
                            <Badge className="text-[10px] h-6 font-bold bg-red-500 text-white">{type}</Badge>
                        )}
                        {duration && (
                            <Badge className="text-[10px] h-6 font-bold bg-[--primary-color] text-white">{duration}</Badge>
                        )}
                    </div>
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-500 ease-in-out z-10">
                        <Play size={35} fill="white" />
                    </div>
                </div>
            </Link>
            <div className="flex flex-col items-start justify-start pt-1.5">
                <div className="w-full h-7 line-clamp-1">
                    <span className="font-sans text-sm font-semibold text-[--text-color]">{title}</span>
                </div>
                <span className="text-xs font-sans font-normal text-[--secondary-color] pr-4">{currentText} {currentEpisode}</span>
            </div>
        </Card>
    </Tooltip>
  );
};

export default DisplayCard;