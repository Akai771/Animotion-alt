import React, {useState, useEffect} from "react";
import { Link, useParams, useNavigate } from 'react-router-dom';
import axios from "axios";
import "./VideoInfo.css";
import Navbar from "../../Navbar/Navbar";
import ChatbotButton from "../../Chatbot/ChatbotButton/ChatbotButton";
import TopRedirect from "../../TopRedirectButton/TopRedirect";
import Footer from "../../Footer/Footer";
import Preloader from "../../Preloader/Preloader";
import CharacterCard from "../VideoMain/characterCard";
import ReactPlayer from "react-player";
import WatchlistButton from "./WatchButtons/watchlistButton";
import WatchNowButton from "./WatchButtons/watchNowButton";
import RecommendCard from "./RecommendCard/recommendCard";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Comment from "./Comments/comment";
import Slider from "react-slick";

const VideoInfo = () => {
    const [animeData, setAnimeData] = useState([]);
    const [addData, setAddData] = useState([])
    const [addData2, setAddData2] = useState([])
    const [recommendPop, setRecommendPop] = useState([]);
    const [screenWidth, setScreenWidth] = useState(window.innerWidth);
    const [episode, setEpisode] = useState([]);

    const {id} = useParams();
    const navigate = useNavigate();
    var settings = {}

    const handleResize = () => {
      setScreenWidth(window.innerWidth);
    };
  
    useEffect(() => {
      window.addEventListener('resize', handleResize);
      return () => {
        window.removeEventListener('resize', handleResize);
      };
    }, []);

    let dataBasedOnScreenSize;

    const handleGenreRedirect = (genre) => {
        const genreArray = genre.split(" ");
        const newGenre = genreArray.join("-").toLowerCase();
        navigate(`/genre/${newGenre}`);
    }

    try{
        useEffect(()=>{
            axios.get(`https://animotion-aniwatch-api.vercel.app/anime/info?id=${id}`)
            .then((res) => {
                setAnimeData(res.data.anime.info)
                setAddData(res.data.anime.moreInfo)
                setRecommendPop(res.data.seasons)
            })

            axios.get(`https://animotion-aniwatch-api.vercel.app/anime/episodes/${id}`)
            .then((res) => {
                setEpisode(res.data.episodes[0].episodeId)
            });

            axios.get(`https://api.anify.tv/search/anime/${id}`)
            .then((res) => setAddData2(res.data.results[0]))

        },[id])
    }
    catch(err){
        console.log(err);
    }

    if (screenWidth < 768) {
        settings = {
            dots: true,
            infinite: true,
            speed: 400,
            slidesToShow: 2,
            slidesToScroll: 2
        };
    } 
    else {
        settings = {
            dots: true,
            infinite: true,
            speed: 400,
            slidesToShow: 7,
            slidesToScroll: 2
        };
    }

    return(<>
        <Preloader/>
        <Navbar />
        <div className="videoInfoPage">
            <div className="video-info-container">
                <img src={animeData.poster?animeData.poster:"https://via.placeholder.com/150x190"} alt="Anime Cover Image" className="video-info-cover-image" id="animeImage"/>
                <div className="alignVidInfo">
                    <span className="AnimeTitle">{animeData.name}</span>
                    <span className="AnimeTags2"><span className="AnimeTags">{animeData.stats?animeData.stats.rating:"No Data"}</span> | <span className="AnimeTags">{animeData.stats?animeData.stats.type:"No Data"}</span> | <span className="AnimeTags">{addData?addData.duration:"No Data"}</span></span>
                    <span className="AnimeInfoTitle">Other Titles: <span className="AnimeInfo2"> {addData.japanese?addData.japanese:"No Title"}</span></span>
                    <div className="descBoxBtnDiv">
                        <span className="AnimeInfoTitle">Genres: 
                        {addData.genres?addData.genres.map((genre) =>{
                            return(
                                <button key={genre} className="descBoxBtn" onClick={()=>handleGenreRedirect(genre)}>{genre}</button>
                            )
                        }):"No Data"} </span>
                    </div>
                    <span className="AnimeInfoTitle">Release Date: <span className="AnimeInfo">{addData.aired}</span></span>
                    <span className="AnimeInfoTitle">Status: <span className="AnimeInfo">{addData.status}</span></span>
                    <span className="AnimeInfoTitle">Episodes: <span className="AnimeInfo">{animeData.stats?animeData.stats.episodes.sub:0}</span></span>
                    <span className="AnimeInfoTitle">MAL Score: <span className="AnimeInfo">{addData?addData.malscore:"No Data"}</span></span>
                    <span className="AnimeInfoTitle">Studio: <span className="AnimeInfo">{addData?addData.studios:"No Data"}</span></span>
                    <div className="episodeBtnGrp2">
                        <WatchNowButton animeId={animeData.id} animeTitle={animeData.name} animeImage={animeData.poster} animeEpisode={episode}/>
                        <WatchlistButton animeId={animeData.id} animeTitle={animeData.name} animeImage={animeData.poster}/>
                    </div>
                    <br/>
                    <div className="AnimeDescSection">
                        <span className="AnimeDescTitle">Synopsis: </span>
                        <br/>   
                        <span className="AnimeDesc">{animeData.description}</span>
                    </div>
                    <br/>
                    <div className="characters">
                        <span className="characterTitle2">Characters:</span>
                        <div className="characterCardAlign">
                            {addData2 && addData2.characters
                                ?addData2.characters.slice(0,6).map((character) => (
                                    <CharacterCard 
                                    image={character.image?character.image:"https://via.placeholder.com/150x190"} 
                                    c_name={character.name?character.name:"No Data"}
                                    />
                            )):null}
                        </div>
                    </div>
                    <br/><br/>
                    <div className="trailerSection">
                        <span className="characterTitle2">Trailer:</span>
                        <ReactPlayer className="reactTrailerPlayer" url={addData2 && addData2.trailer?addData2.trailer:"https://www.youtube.com/watch?v=xvFZjo5PgG0&ab_channel=Duran"} title="YouTube video player" />
                    </div>
                </div>
            </div>
            <div className={recommendPop.length === 0?"noSectionDisp":"recommendedSection"}>
                <span className="AnimeTitle">Seasons:</span>
                    <div className="alignRecommendAnime">
                    {/* <Slider {...settings}> */}
                        {recommendPop.map((season) => (
                            <RecommendCard key={season.id} id={season.id} title={season.name} image={season.poster} />
                            ))
                        }
                    {/* </Slider> */}
                    </div>
            </div>
            <div className="commentSection">
                <span className="AnimeTitle">Comments:</span>
                <Comment animeId={id}/>
            </div>
        </div>
        <Footer />
        <ChatbotButton />
        <TopRedirect location="#animeImage"/>
    </>)
}

export default VideoInfo;