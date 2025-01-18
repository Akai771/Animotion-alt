import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import "./VidCard3.css";
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import Tooltip from "@mui/material/Tooltip";
import ClosedCaptionOffIcon from '@mui/icons-material/ClosedCaptionOff';
import MicNoneIcon from '@mui/icons-material/MicNone';
import StarIcon from '@mui/icons-material/Star';

const VidCard3 = ({id, title, coverImage, currentEpisode, type, duration}) => {
  const [qtipData, setQtipData] = useState([]);


    useEffect(()=>{
      axios.get(`${import.meta.env.VITE_API}/api/v2/hianime/qtip/${id}`)
      .then((res) => {
          setQtipData(res.data.data.anime)
      })
      .catch((err) => {
          console.log("Error Fetching Qtip Data: ",err);
      })
    },[id])

    const episodeSub = qtipData.episodes?.sub || "N/A";
    const episodeDub = qtipData.episodes?.dub || "N/A";
    const genres = qtipData.genres || [];

    return (
      <>
        <div class="trialCard">
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
            <div className="trialCardImage">
              <Link exact to={`/details/${id}`}>
                  <img className="trialImage" src={coverImage} alt={title} />
                    <div className="trialCardOverlay">
                        <div className="trialCardOverlayCont">
                            <span className="trialInfoBtn2">{type}</span>
                            <span className="trialInfoBtn1">{duration}</span>
                        </div>
                    </div>
                  <div className="playIcon">
                    <PlayArrowIcon id="playIcon-home"/>
                  </div>
              </Link>
            </div>
            <div class="trial-info">
                <div className="trialTitleAlign">
                    <span class="trialTitle">{title}</span>
                </div>
                <div className="trialInfo">
                    <span className="trialInfoCont">EP {currentEpisode}</span>
                </div>
            </div>
            </Tooltip>
        </div>
      </>
  );
};

export default VidCard3;