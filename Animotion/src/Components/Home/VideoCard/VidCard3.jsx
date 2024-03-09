import React from "react";
import { Link } from "react-router-dom";
import "./VidCard3.css";
import PlayArrowIcon from '@mui/icons-material/PlayArrow';

const VidCard3 = ({id, title, coverImage, currentEpisode, type, duration}) => {
    return (
      <>
        <div class="trialCard">
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
                    <span class="trialTitle">{title.slice(0,20)}...</span>
                </div>
                <div className="trialInfo">
                    <span className="trialInfoCont">EP {currentEpisode}</span>
                </div>
            </div>
        </div>
      </>
    );
};

export default VidCard3;