import React, {useState, useEffect} from "react";
import { useParams, useSearchParams, useNavigate, Link} from 'react-router-dom';
import axios from "axios";
import "./VideoMain.css";
import NavBar from "../../Navbar/Navbar";
import Footer from "../../Footer/Footer";
import ChatbotButton from "../../Chatbot/ChatbotButton/ChatbotButton";
import TopRedirect from "../../TopRedirectButton/TopRedirect";
import Preloader from "../../Preloader/Preloader";
import FastRewindIcon from '@mui/icons-material/FastRewind';
import FastForwardIcon from '@mui/icons-material/FastForward';
import ClosedCaptionOutlinedIcon from '@mui/icons-material/ClosedCaptionOutlined';
import KeyboardVoiceOutlinedIcon from '@mui/icons-material/KeyboardVoiceOutlined';
import VideoPlayer from "./VideoPlayer";
import RecommendCard from "../VideoInfo/RecommendCard/recommendCard";
import Tooltip from "@mui/material/Tooltip";

const VideoMain = () => {
    const {id} = useParams();
    const [searchParams, setSearchParams] = useSearchParams()
    const defaultEpisodeId = `${id}-episode-1`
    const histEpisodeId = searchParams?searchParams.get('epId'): defaultEpisodeId;

    const [animeData, setAnimeData] = useState([]);
    const [serverInfo, setServerInfo] = useState([])
    const [serverLink, setServerLink] = useState([])
    const [serverLink2, setServerLink2] = useState([])
    const [serverUrl, setServerUrl] = useState("")
    const [serverUrl2, setServerUrl2] = useState("")
    const [episode, setEpisode] = useState([])
    const [format, setFormat] = useState("sub");
    const [episodeId, setEpisodeId] = useState(histEpisodeId);
    const [episodeNumber, setEpisodeNumber] = useState(0);
    const [selectedOption, setSelectedOption] = useState(0);
    const [serverChangeBtn, setServerChangeBtn] = useState("serverChangeBtn");
    const [recommendPop, setRecommendPop] = useState([]);
    const navigate = useNavigate();

    useEffect(()=>{
        axios.get(`${import.meta.env.VITE_API}/api/v2/hianime/anime/${id}/episodes`)
        .then((res) => {
            setEpisode(res.data.data.episodes)
        });

        axios.get(`${import.meta.env.VITE_API}/api/v2/hianime/anime/${id}`)
        .then((res) => {
            setAnimeData(res.data.data.anime.info)
            setRecommendPop(res.data.data.seasons)
        });
        window.scrollTo(0, 0);
    },[id])
    
    useEffect(()=>{
        axios.get(`${import.meta.env.VITE_API}/api/v2/hianime/episode/servers?animeEpisodeId=${episodeId}`)
        .then((res) => {
            setServerInfo(res.data.data)
            setEpisodeNumber(res.data.data.episodeNo)
            console.log(episodeId)
        })     
        .catch((err) => console.error("Error fetching server data:", err))

        axios.get(`${import.meta.env.VITE_API}/api/v2/hianime/episode/sources?animeEpisodeId=${episodeId}?server=hd-2&category=sub`)
        .then((res) => {
            setServerLink(res.data.data)
            setServerUrl(res.data.data.sources[0].url)
        })

        axios.get(`${import.meta.env.VITE_API}/api/v2/hianime/episode/sources?animeEpisodeId=${episodeId}?server=hd-1&category=dub`)
        .then((res) => {
            setServerLink2(res.data.data)
            setServerUrl2(res.data.data.sources[0].url)
        })
    },[episodeId, format])

    // console.log(serverLink, serverLink2)

    // const handleLanguangeChange = () => {
    //     if (format === "sub") {
    //         setServerUrl(serverLink.sources[0].url)
    //     }
    //     else {
    //         setServerUrl(serverLink2.sources[0].url)
    //     }
    // }

    // useEffect(()=>{
    //     handleLanguangeChange()
    // },[format])

    useEffect(()=>{
        if (!serverUrl2) {
            setServerChangeBtn("serverChangeBtnDisabled")
        }
        else {
            setServerChangeBtn("serverChangeBtn")
        }
    },[serverLink2])

    useEffect(()=>{
        handleEpNumber()
    },[serverInfo.episodeNo])

    function handleEpNumber() {
        setSelectedOption(serverInfo.episodeNo)
        setEpisodeNumber(serverInfo.episodeNo)
    }


    const handleNextEp = () => {
        const nextEpNo = serverInfo.episodeNo;
        const nextEpId = episode[nextEpNo].episodeId;
        navigate(`/watch/${id}?epId=${nextEpId}`);
        window.location.reload();
    }
    
    const handlePrevEp = () => {
        const prevEpNo = serverInfo.episodeNo - 2;
        const prevEpId = episode[prevEpNo].episodeId;
        navigate(`/watch/${id}?epId=${prevEpId}`);
        window.location.reload();
    }

    const handleOptionChange = (e) => {
        const episodeNo = e.target.name;
        setSelectedOption(episodeNo);
        navigate(`/watch/${id}?epId=${e.target.value}`)
        window.location.reload();
      };

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
            <div className="video-player-wrapper">
                <VideoPlayer
                    className="video-player" 
                    mal={serverLink?serverLink.malID:null}
                    serverLink={format=="sub"?serverUrl:serverUrl2} 
                    trackSrc={serverLink.tracks} 
                    thumbnails={animeData.thumbnails}
                />
                <div className="ServerBox">
                    <div className="serverBoxCont1">
                        <span className="ServerInfoTitle">Episode: <span className="ServerInfo">{serverInfo.episodeNo}</span></span>
                        <div className="serverChangeBox">
                            <span className="serverTags">Format : </span>
                            <span className="serverTags">
                                <button className="serverChangeBtn" onClick={()=> setFormat("sub")}><ClosedCaptionOutlinedIcon id="subIcon"/> Sub</button>
                                <button className={serverChangeBtn} onClick={()=> setFormat("dub")}><KeyboardVoiceOutlinedIcon id="dubIcon"/> Dub</button>
                            </span>
                        </div>
                    </div>
                    <div className="serverBoxCont2">
                        <button className="epChangeButton" onClick={handlePrevEp}><FastRewindIcon id="epChangeIcon" />Prev</button>
                        <button className="epChangeButton" onClick={handleNextEp}>Next<FastForwardIcon id="epChangeIcon"/></button>
                    </div>
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
                                <Tooltip title={
                                    <div>
                                        <span className={anime.isFiller == true?"FillerDisplay":"FillerNone"}>Filler Episode</span>
                                        <span className="Tooltip">{anime.title?anime.title:`Episode ${anime.number}`}</span>
                                    </div>                                } placement="top" arrow disableInteractive>
                                    <div className={anime.isFiller == true?"episodeRadioBtnGrpFiller":"episodeRadioBtnGrp"}>
                                        <label className="episodeBtnLabel" key={anime.episodeId} htmlFor={anime.episodeId}>
                                            <input  className="episodeRadioBtn" type="radio" name={anime.number} id={anime.episodeId} value={anime.episodeId} checked={selectedOption == anime.number} onChange={handleOptionChange}/>
                                            <span className="episodeRadioSpan">{anime.number}</span>
                                        </label>
                                    </div>
                                </Tooltip>
                                </>)
                                }
                            )}
                        </div>
                    </div>
                </div>
            </div>
            <br/>
            <div className="alignVidMain">
                <Link to={`/details/${id}`}>
                    <img src={animeData.poster} alt="Anime Cover Image" className="video-info-cover-image"/>
                </Link>
                <div className="VidDescSection2">
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
            <div className={recommendPop.length === 0?"noSectionDisp":"recommendedSection"}>
                <span className="AnimeTitle">Seasons:</span>
                    <div className="alignRecommendAnime">
                        {recommendPop.map((season) => (
                            <RecommendCard key={season.id} id={season.id} title={season.name} image={season.poster} />
                            ))
                        }
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