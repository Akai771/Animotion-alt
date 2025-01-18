import React from "react";
import { useEffect, useState } from "react";
import "./recentEpisodes.css";
import NavBar from "../../Navbar/Navbar";
import Footer from "../../Footer/Footer";
import ChatbotButton from "../../Chatbot/ChatbotButton/ChatbotButton";
import TopRedirect from "../../TopRedirectButton/TopRedirect";
import axios from "axios";
import VidCard3 from "../VideoCard/VidCard3";
import KeyboardDoubleArrowRightIcon from '@mui/icons-material/KeyboardDoubleArrowRight';
import KeyboardDoubleArrowLeftIcon from '@mui/icons-material/KeyboardDoubleArrowLeft';
import Preloader from "../../Preloader/Preloader";

const RecentEpisodes = () => {
    const [page, setPage] = useState(1);
    const [recentEp, setRecentEp] = useState([]);
    
    const handleNextPage = () => {
        if(page>0){
            setPage(page+1);
        
        }
    }

    const handlePrevPage = () => {
        if(page>1){
            setPage(page-1);
        }
    }
    const [count, setCount] = useState(1);
    

    function handleChange1() {
        setCount(count + 1);
    }

    function handleChange2() {
        if (count > 1){
            setCount(count - 1);
        }
    }

    useEffect(()=>{
        axios.get(`${import.meta.env.VITE_API}/api/v2/hianime/home`)
        .then((res) => setRecentEp(res.data.data.latestEpisodeAnimes))
    },[])

    return(<>
        <div>
            <Preloader/>
            <NavBar/>
            <div className="browseContent">
                <span className="browseTitle2" id="browse">Latest Episodes</span>
                <div className="container">
                    <div class="row">
                        <div>
                            <div className="BrowseAnimeContainer">
                                <div className="alignBrowseAnime">
                                    {recentEp.map((seasonal) => (
                                            <VidCard3 id={seasonal.id} title={seasonal.name} coverImage={seasonal.poster?seasonal.poster:"https://upload.wikimedia.org/wikipedia/commons/thumb/6/65/No-Image-Placeholder.svg/832px-No-Image-Placeholder.svg.png"} currentEpisode={seasonal.episodes.sub} type={seasonal.type} duration={seasonal.duration} />
                                        ))
                                    }
                                </div>
                                {/* <div className="pageBtnGrp">
                                    <button className="pageBtn" onClick={handlePrevPage}><KeyboardDoubleArrowLeftIcon/>Prev Page</button>
                                    <input class="quantity-input" type="text" value={page} disabled/>
                                    <button className="pageBtn" onClick={handleNextPage}>Next Page <KeyboardDoubleArrowRightIcon/></button>
                                </div> */}
                            </div>  
                        </div>
                    </div>
                </div>
                <br/><br/>                
            </div>
            <Footer/>
            <ChatbotButton/>
            <TopRedirect location="#browse"/>
        </div>
    </>)
}

export default RecentEpisodes;