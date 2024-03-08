import React from "react";
import { Link, useNavigate } from "react-router-dom";
import "./VidCard.css";
import "../../Video/VideoInfo/RecommendCard/recommendCard.css"
import PlayArrowIcon from '@mui/icons-material/PlayArrow';

const VidCard = ({id, title, coverImage, currentEpisode, type, duration}) => {
    return (
      <>
        <div class="recentEpCard">
            <div className="recentEpCardImage">
              <Link exact to={`/details/${id}`}>
                  <img className="recentEpImage" src={coverImage} alt={title} />
                  <div className="playIcon">
                    <PlayArrowIcon id="playIcon-home"/>
                  </div>
              </Link>
            </div>
            <div class="recentEp-info">
              <span class="recentEpTitle">{title.slice(0,30)}...</span>
              <div className="recentEpInfo">
                <span className="recentEpInfoCont">{type}</span>
                <span className="recentEpInfoCont">EP {currentEpisode}</span>
                <span className="recentEpInfoCont">{duration}</span>
              </div>
            </div>
        </div>
      </>
    );
};



export default VidCard;