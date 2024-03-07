import React, {useState, useEffect} from "react";
import { useParams, useSearchParams, useNavigate} from 'react-router-dom';
import axios from "axios";
import "./VideoMain.css";
import NavBar from "../../Navbar/Navbar";
import Footer from "../../Footer/Footer";
import ChatbotButton from "../../Chatbot/ChatbotButton/ChatbotButton";
import TopRedirect from "../../TopRedirectButton/TopRedirect";
import Preloader from "../../Preloader/Preloader";
import CharacterCard from "./characterCard";
import FastRewindIcon from '@mui/icons-material/FastRewind';
import FastForwardIcon from '@mui/icons-material/FastForward';
import ClosedCaptionOutlinedIcon from '@mui/icons-material/ClosedCaptionOutlined';
import KeyboardVoiceOutlinedIcon from '@mui/icons-material/KeyboardVoiceOutlined';
import VideoPlayer from "./VideoPlayer";

const VideoMain = () => {
    const {id} = useParams();
    const [searchParams, setSearchParams] = useSearchParams()
    const defaultEpisodeId = `${id}-episode-1`
    const histEpisodeId = searchParams?searchParams.get('epId'): defaultEpisodeId;
    const histEpisodeNumber = histEpisodeId?parseInt(histEpisodeId.split("-").pop()):1

    const [animeData, setAnimeData] = useState([]);
    const [serverInfo, setServerInfo] = useState([])
    const [serverLink, setServerLink] = useState([])
    const [episode, setEpisode] = useState([])
    const [format, setFormat] = useState("sub");
    const [epNo, setEpNo] = useState(0);
    const [selectedOption, setSelectedOption] = useState(1);
    const [episodeId, setEpisodeId] = useState(histEpisodeId);
    const [episodeNumber, setEpisodeNumber] = useState(histEpisodeNumber);
    const [addData, setAddData] = useState([]);

    const navigate = useNavigate();
    
    const handleOptionChange = (e) => {
        setEpisodeId(e.target.value);
        setEpNo(e.target.name);
        setSelectedOption(e.target.name);
        navigate(`/watch/${id}?epId=${e.target.value}`)
      };

      const handleNextEp = () => {
        if (epNo >= 1 && epNo < episode.length) {
            const newEpNo = epNo + 1;
            setEpNo(newEpNo);
            const newEpId = `${id}-episode-${newEpNo}`
            setEpisodeId(newEpId);
            navigate(`/watch/${id}?epId=${newEpId}`);
            window.location.reload();
        }
    }
    
    const handlePrevEp = () => {
        if (epNo > 1) {
            const newEpNo = epNo - 1;
            setEpNo(newEpNo);
            const newEpId = `${id}-episode-${newEpNo}`
            setEpisodeId(newEpId);
            navigate(`/watch/${id}?epId=${newEpId}`);
            window.location.reload();
        } 
    }

    useEffect(()=>{
        axios.get(`https://animotion-aniwatch-api.vercel.app/anime/episodes/${id}`)
        .then((res) => {
            setEpisode(res.data.episodes)
        });

        axios.get(`https://animotion-aniwatch-api.vercel.app/anime/info?id=${id}`)
        .then((res) => {
            setAnimeData(res.data.anime.info)
        });

        axios.get(`https://api.anify.tv/search/anime/${id}`)
        .then((res) => setAddData(res.data.results[0]));

    },[id])
    
    useEffect(()=>{
        axios.get(`https://animotion-aniwatch-api.vercel.app/anime/servers?episodeId=${episodeId}`)
        .then((res) => {
            setServerInfo(res.data)
            setEpisodeNumber(serverInfo.episodeNo)
            setEpNo(serverInfo.episodeNo)
        })     
        .catch((err) => console.error("Error fetching server data:", err))

        axios.get(`https://animotion-aniwatch-api.vercel.app/anime/episode-srcs?id=${episodeId}&category=${format}`)
        .then((res) => {
            setServerLink(res.data)})
    },[episodeId, id, format])

    var specificAnimeID = JSON.parse(localStorage.getItem('history'))
    if (Array.isArray(specificAnimeID)) {
        var targetAnimeId = id;
        var targetIndex = specificAnimeID.findIndex(function(anime) {
          return anime.animeId === targetAnimeId;
        });
        if (targetIndex !== -1) {
          specificAnimeID[targetIndex].animeEpisodeId = episodeId;
        } else {
          console.error("AnimeId not found in 'history'");
        }
        localStorage.setItem('history', JSON.stringify(specificAnimeID));
    } 
    else {
        console.error("Invalid data format in 'history'");
    }
    return(<>
        <Preloader/>
        <NavBar />
        <div className="video-main-container">
            {/* <ReactPlayer className="AnimeVideoPlayer" url={serverUrl} title="Animotion video player" id="videoPlayer" allowfullscreen="allowfullscreen"/> */}
            <VideoPlayer 
                mal={serverLink?serverLink.malID:null}
                serverLink={serverLink.sources?serverLink.sources[0].url:null} 
                trackSrc={serverLink.tracks} 
            />
            <div className="ServerBox">
                <div className="serveBoxCont1">
                    <span className="ServerInfoTitle">Episode: <span className="ServerInfo">{serverInfo.episodeNo}</span></span>
                </div>
                <div className="serverChangeBox">
                    <span className="serverTags">Format : </span>
                    <span className="serverTags">
                        <button className="serverChangeBtn" onClick={()=> setFormat("sub")}><ClosedCaptionOutlinedIcon id="subIcon"/> Sub</button>
                        <button className="serverChangeBtn" onClick={()=> setFormat("dub")}><KeyboardVoiceOutlinedIcon id="dubIcon"/> Dub</button>
                    </span>
                </div>
                <div className="serveBoxCont2">
                    <button className="epChangeButton" onClick={handlePrevEp}><FastRewindIcon id="epChangeIcon" />Prev</button>
                    <button className="epChangeButton" onClick={handleNextEp}>Next<FastForwardIcon id="epChangeIcon"/></button>
                </div>
            </div>
            <br/>
            <div className="VidEpisodes">
                <div>
                    <span className="AnimeTitle">Episodes:</span>
                    <br/>
                    <div className="episodeBox">
                        <div className="episodeMainBtnGrp">
                            {episode.map((anime) => {       
                                return(<>
                                    <div className="episodeRadioBtnGrp">
                                        <label className="episodeBtnLabel" key={anime.episodeId} htmlFor={anime.episodeId}>
                                            <input  className="episodeRadioBtn" type="radio" name={anime.number} id={anime.episodeId} value={anime.episodeId} checked={selectedOption == anime.number} onChange={handleOptionChange}/>
                                            <span className="episodeRadioSpan">{anime.number}</span>
                                        </label>
                                    </div>
                                </>)
                                }
                            )}
                        </div>
                    </div>
                </div>
            </div>
            <br/>
            <div className="alignVidMain">
                <img src={animeData.poster} alt="Anime Cover Image" className="video-info-cover-image"/>
                <div className="VidDescSection">
                    <span className="AnimeTitle">{animeData.name}</span>
                    <br/>
                    <span className="AnimeInfo">Episode {episodeNumber}</span>
                    <div className="horizontalLine2"/>
                    <br/>
                    <div> 
                        <span className="AnimeDesc">{animeData.description}</span>
                    </div>
                </div>
            </div>
            <br /><br /><br />
        </div>
        <Footer />
        <ChatbotButton />
        <TopRedirect location="#videoPlayer"/>
    </>)
}

export default VideoMain;