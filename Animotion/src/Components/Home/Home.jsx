import {useEffect, useState, React} from "react";
import CarouselHome from "./Carousel/Carousel.jsx";
import VidCard2 from "./VideoCard/VidCard2.jsx";
import VidCard3 from "./VideoCard/VidCard3.jsx";
import "./Home.css";
import TopRedirect from "../TopRedirectButton/TopRedirect";
import ChatbotButton from "../Chatbot/ChatbotButton/ChatbotButton";
import Navbar from "../Navbar/Navbar";
import Footer from "../Footer/Footer";
import axios from "axios";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";
import Preloader from "../Preloader/Preloader.jsx";
import { Link } from "react-router-dom";
import ChevronRightRoundedIcon from '@mui/icons-material/ChevronRightRounded';
import TrendingCard from "./VideoCard/TrendingCard/TrendingCard.jsx";
import ContWatchingCard from "./VideoCard/ContinueWatching/contWatchCard";

const Home = ({token}) =>{
    const [recentEp, setRecentEp] = useState([]);
    const [upcoming,setUpcoming] = useState([]);
    const [trending, setTrending] = useState([]);
    const [top, setTop] = useState([]);
    const [topAiring, setTopAiring] = useState([]);
    const [screenWidth, setScreenWidth] = useState(window.innerWidth);
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

    useEffect(()=>{
        axios.get("https://animotion-aniwatch-api.vercel.app/anime/home")
        .then((res) => {
            setRecentEp(res.data.latestEpisodeAnimes)
            setTrending(res.data.trendingAnimes)
            setTopAiring(res.data.topAiringAnimes)
            setUpcoming(res.data.topUpcomingAnimes)
            setTop(res.data.top10Animes.month)
        })

        window.scrollTo(0,0);
    },[])

    const contWatching = JSON.parse(localStorage.getItem("history"));

    if (screenWidth < 960) {
        settings = {
            dots: true,
            infinite: true,
            speed: 400,
            slidesToShow: 2,
            slidesToScroll: 2,
            swipeToSlide: true,
        };
    }
    else if (screenWidth < 1600) {
        settings = {
            dots: true,
            infinite: true,
            speed: 400,
            slidesToShow: 6,
            slidesToScroll: 2,
            swipeToSlide: true,
        };
    } 
    else {
        settings = {
            dots: true,
            infinite: true,
            speed: 400,
            slidesToShow: 8,
            slidesToScroll: 2,
            swipeToSlide: true,
        };
    }

    let settings2
    if (screenWidth < 960) {
        settings2 = {
            dots: true,
            infinite: false,
            speed: 400,
            slidesToShow: 1,
            slidesToScroll: 1,
            swipeToSlide: true,
        };
    }
    else if (screenWidth < 1600) {
        settings2 = {
            dots: true,
            infinite: false,
            speed: 400,
            slidesToShow: 4,
            slidesToScroll: 2,
            swipeToSlide: true,
        };
    } 
    else {
        settings2 = {
            dots: false,
            infinite: false,
            speed: 400,
            slidesToShow: 5,
            slidesToScroll: 1,
            swipeToSlide: true,
        };
    }
    
    return(<>

    <Preloader/>
    <Navbar/>
    <div id="topCarousel">
        <CarouselHome />
    </div>
    <section className="alignHomeItems1 popSect">
        <br/>
        {/* Trending Section */}
        <div class="vl"><h3 className="SectionTitle">Trending</h3></div>
        <div className="alignCardMargin"> 
            <Slider {...settings2}>
                {trending.map((trend) => (
                    <TrendingCard key={trend.id} id={trend.id} title={trend.name} coverImage={trend.poster} type={trend.rank} />
                    ))
                }
            </Slider>
        </div>

        <div className="horizontal-Line1" />

        <div className="latest-episode-section">
            <div class="vl"><h3 className="Mont600" style={{color:"#fff", paddingLeft:"10px"}}>Continue Watching</h3></div>
            <Link exact to={`/history`} ><button className="view-more-btn">View More<ChevronRightRoundedIcon id="arrow-Icon"/></button></Link>
        </div>
        <br/>
        <div className="alignCardMargin3">
            {contWatching?contWatching.slice(0,5).map((cont) => (
                <ContWatchingCard key={cont.animeId} id={cont.animeId} title={cont.animeTitle} coverImage={cont.animeImage} currentEpisode={cont.animeEpisodeId}/>
                )): <span className="contWatchingAlert">Start Watching to see your history here!</span>
            }
        </div>

        <div className="horizontal-Line1" />

        {/* Latest Episodes Section */}
        <div className="latest-episode-section">
            <div class="vl"><h3 className="SectionTitle">Latest Episodes</h3></div>
            <Link exact to={`/latest-episodes`} ><button className="view-more-btn">View More<ChevronRightRoundedIcon id="arrow-Icon"/></button></Link>
        </div>
        <div className="alignCardMargin2">
            {recentEp.map((recentEp) => (
                <VidCard3 key={recentEp.id} id={recentEp.id} title={recentEp.name} coverImage={recentEp.poster} currentEpisode={recentEp.episodes.sub} type={recentEp.type} duration={recentEp.duration}/>
                ))
            }
        </div>

        <div className="horizontal-Line2" />

        {/* Advertisement Section */}
        <div className="AnimePromotion">
            <Link to="/details/solo-leveling-18718">
                <img
                    src="https://i.postimg.cc/HkyBJQp2/Solo-Leveling-Watch-Now-AD.png"
                    alt="Anime Promotion"
                    className="AnimePromotionImg"
                />
            </Link>
        </div>

        <div className="horizontal-Line2" />

        {/* Top Airing Section */}
        <div class="vl"><h3 className="SectionTitle">Top Airing</h3></div>
        <div className="alignCardMargin">
            <Slider {...settings}>
            {topAiring.map((movie) => (
                    <VidCard2 key={movie.id} id={movie.id} title={movie.name} coverImage={movie.poster} type={movie.otherInfo[0]} />
                    ))
                }
            </Slider>
        </div>

        <div className="horizontal-Line2" />

        {/* Popular Anime Section */}
        <div class="vl"><h3 className="SectionTitle">Popular Anime This Month</h3></div>
        <div className="alignCardMargin">
            <Slider {...settings}>
            {top.map((movie) => (
                    <VidCard2 key={movie.id} id={movie.id} title={movie.name} coverImage={movie.poster} type={movie.rank} />
                    ))
                }
            </Slider>
        </div>

        <div className="horizontal-Line2" />

        {/* Advertisement Section */}
        <div className="AnimePromotion">
            <Link to="/details/one-piece-100">
                <img
                    src="https://i.postimg.cc/9fMs7Zvk/One-Piece-Ad.png"
                    alt="Anime Promotion"
                    className="AnimePromotionImg"
                />
            </Link>
        </div>

        <div className="horizontal-Line2" />

        {/* Upcoming Anime Section */}
        <div class="vl"><h3 className="SectionTitle">Upcoming Anime</h3></div>
        <div className="alignCardMargin">
        <Slider {...settings}>
            {upcoming.map((seasonal) => (
                        <VidCard2 key={seasonal.id} id={seasonal.id} title={seasonal.name} coverImage={seasonal.poster} type={seasonal.type}/>
                    ))
                }
        </Slider>
        </div>
        <br/><br/> 
    </section>
    <Footer/>
    <TopRedirect/>
    <ChatbotButton/>
    </>);
}

export default Home;