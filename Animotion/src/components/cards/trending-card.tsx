// src/components/cards/trending-card.tsx
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Play, Star, Mic, Captions } from "lucide-react";
import "../../styling/cards.css";
import Tooltip from "@mui/material/Tooltip";
import { useIsMobile } from "@/hooks/use-mobile";

type TrendingCardProps = {
  id: string;
  title: string;
  coverImage: string;
  type: string;
  duration?: string;
};

const TrendingCard: React.FC<TrendingCardProps> = ({ id, title, coverImage, type }) => {
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
      <div className="mb-3 px-2">
        <Link to={`/details/${id}`} className="block w-full">
          <Card className="relative overflow-hidden h-40 shadow-md hover:shadow-lg transition-all duration-300">
            <div className="absolute inset-0">
              <img 
                src={coverImage} 
                alt={title} 
                className="w-full h-full object-cover"
              />
              {/* Gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent" />
            </div>
            
            {/* Rank badge */}
            <div className="absolute top-2 right-2">
              <Badge className="bg-[--primary-color] text-white font-bold px-2 py-1">
                #{type}
              </Badge>
            </div>
            
            {/* Content */}
            <div className="absolute bottom-0 left-0 p-3 w-full">
              <h3 className="font-bold text-white text-base mb-1 line-clamp-1">{title}</h3>
              
              {/* Play button */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1">
                  <Play className="text-white" fill="white" size={14} />
                  <span className="text-white text-xs">Watch Now</span>
                </div>
              </div>
            </div>
          </Card>
        </Link>
      </div>
    );
  }

  // Desktop version - original implementation
  return (
    <Tooltip title={
      <div className="flex flex-col p-1">
        <span className="text-2xl font-bold mb-1">{qtipData.name}</span>
        <div className="flex flex-row gap-[.2rem] mb-4">
          <Badge className="text-xs rounded-lg bg-[#f0c929] gap-1"><Star size={15} className="fill-white dark:fill-black" />{qtipData?.malscore}</Badge>
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
      <div className="trendingCardDiv">
        <Link to={`/details/${id}`} className="trendingLink">
          <Card className="trendingCard">
            <CardContent className="trendingCard-Info">
              <div className="trendingTitleAlign">
                <span className="trendingTitle">{title}</span>
              </div>
              <div className="trendingCardRankDiv">
                <span className="trendingCardRank">{type}</span>
              </div>
            </CardContent>
            <div className="trendingCardImage">
              <img className="trendingImage" src={coverImage} alt={title} />
              <div className="playIcon">
                <Play size={35} fill="white" />
              </div>
            </div>
          </Card>
        </Link>
      </div>
    </Tooltip>
  );
};

export default TrendingCard;