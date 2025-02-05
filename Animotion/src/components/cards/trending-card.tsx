import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Play, Star, Mic, Captions } from "lucide-react";
import "../../styling/cards.css"
import Tooltip from "@mui/material/Tooltip";

type TrendingCardProps = {
  id: string;
  title: string;
  coverImage: string;
  type: string;
  duration?: string;
};

const TrendingCard: React.FC<TrendingCardProps> = ({ id, title, coverImage, type }) => {
  const [qtipData, setQtipData] = useState<any>({});

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_API}/api/v2/hianime/qtip/${id}`)
      .then((res) => {
        setQtipData(res.data.data.anime);
      })
      .catch((err) => {
        console.error("Error fetching Qtip Data: ", err);
      });
  }, [id]);

  const episodeSub = qtipData?.episodes?.sub || "N/A";
  const episodeDub = qtipData?.episodes?.dub || "N/A";
  const genres = qtipData?.genres || [];

  return (
      <Tooltip title={
              <div className="flex flex-col p-1">
                <span className="text-2xl font-bold mb-1">{qtipData.name}</span>
                <div className="flex flex-row gap-[.2rem] mb-4">
                  <Badge className="text-xs rounded-lg bg-[#f0c929] gap-1"><Star size={15} fill="black"/>{qtipData?.malscore}</Badge>
                  <Badge className="text-xs rounded-lg bg-[--primary-color] text-[--text-color] gap-1">{qtipData?.type}</Badge>
                  <Badge className="text-xs rounded-lg bg-[--primary-color] text-[--text-color] gap-1"><Captions size={15} />{episodeSub}</Badge>
                  <Badge className="text-xs rounded-lg bg-[--primary-color] text-[--text-color] gap-1"><Mic size={15} />{episodeDub}</Badge>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-sm text-[--secondary-color] font-semibold">Jname:  <span className="text-xs text-[--text-color] font-normal">{qtipData.jname?qtipData.jname:"N/A"} </span></span>
                  <span className="text-sm text-[--secondary-color] font-semibold">Genres: <span className="text-xs text-[--text-color] font-normal">{genres.join(", ")} </span></span>
                  <span className="text-sm text-[--secondary-color] font-semibold">Aired: <span className="text-xs text-[--text-color] font-normal">{qtipData.aired} </span></span>
                  <span className="text-sm text-[--secondary-color] font-semibold">Status: <span className="text-xs text-[--text-color] font-normal">{qtipData.status} </span></span>
                  <span className="text-sm text-[--secondary-color] font-semibold">Desc: <span className="text-xs text-[--text-color] font-normal">{qtipData.description? qtipData.description: "N/A"} </span></span>
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
