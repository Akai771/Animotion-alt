import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./TrendingCard.css";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import axios from "axios";
import Tooltip from "@mui/material/Tooltip";
import ClosedCaptionOffIcon from '@mui/icons-material/ClosedCaptionOff';
import MicNoneIcon from '@mui/icons-material/MicNone';
import StarIcon from '@mui/icons-material/Star';



const TrendingCard = ({ id, title, coverImage, type, duration }) => {
  const [qtipData, setQtipData] = useState([]);
  useEffect(()=>{
      axios.get(`${import.meta.env.VITE_API}/api/v2/hianime/qtip/${id}`)
      .then((res) => {
        setQtipData(res.data.data.anime)
      })
      .catch((err) => {
        console.log("Error Fetching Qtip Data: ",err);
      })
  },[])
  
  const episodeSub = qtipData.episodes?.sub || "N/A";
  const episodeDub = qtipData.episodes?.dub || "N/A";
  const genres = qtipData.genres || [];
  
  return (
    <>
      <Tooltip title={
        <div className="Tooltip">
          <span className="TooltipTitle">{qtipData.name}</span>
          <div className="TooltipQuickInfo">
            <div className="TooltipQuickInfoBoxGold"><StarIcon style={{fontSize:"1.2rem", marginRight:".2rem"}} /> {qtipData.malscore}</div>
            <div className="TooltipQuickInfoBox">{qtipData.type}</div>
            <div className="TooltipQuickInfoBox"><ClosedCaptionOffIcon style={{fontSize:"1.2rem", marginRight:".2rem"}}/> {episodeSub}</div>
            <div className="TooltipQuickInfoBox"><MicNoneIcon style={{fontSize:"1.2rem", marginRight:".2rem"}} /> {episodeDub}</div>
          </div>
          <div className="TooltipContBox">
            <span className="TooltipContTitle">Jname:  <span className="TooltipCont">{qtipData.jname?qtipData.jname:"N/A"} </span></span>
            <span className="TooltipContTitle">Genres: <span className="TooltipCont">{genres.join(", ")} </span></span>
            <span className="TooltipContTitle">Aired: <span className="TooltipCont">{qtipData.aired} </span></span>
            <span className="TooltipContTitle">Status: <span className="TooltipCont">{qtipData.status} </span></span>
            <span className="TooltipContTitle">Desc: <span className="TooltipCont">{qtipData.description? qtipData.description: "N/A"} </span></span>
          </div>
        </div>
      } placement="right" arrow disableInteractive>
        <Link exact to={`/details/${id}`} className="trendingLink">
          <div class="trendingCard">
            <div className="trendingCard-Info">
              <div className="trendingTitleAlign">
                <span class="trendingTitle">{title}</span>
              </div>
              <div className="trendingCardRankDiv">
                <span className="trendingCardRank">{type}</span>
              </div>
            </div>
            <div className="trendingCardImage">
              <img className="trendingImage" src={coverImage} alt={title} />
              <div className="playIcon2">
                <PlayArrowIcon id="playIcon2-home" />
              </div>
            </div>
          </div>
      </Link>
      </Tooltip>
    </>
  );
};

export default TrendingCard;
