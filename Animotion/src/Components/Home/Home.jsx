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
            console.log(top)
        })
    },[])

    if (screenWidth < 960) {
        settings = {
            dots: true,
            infinite: true,
            speed: 400,
            slidesToShow: 2,
            slidesToScroll: 2
        };
    }
    else if (screenWidth < 1600) {
        settings = {
            dots: true,
            infinite: true,
            speed: 400,
            slidesToShow: 6,
            slidesToScroll: 2
        };
    } 
    else {
        settings = {
            dots: true,
            infinite: true,
            speed: 400,
            slidesToShow: 8,
            slidesToScroll: 2
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
        <div class="vl"><h3 className="Mont600" style={{color:"#fff", paddingLeft:"10px"}}>Trending</h3></div>
        <br/>
        <div className="alignCardMargin"> 
            <Slider {...settings}>
                {trending.map((trend) => (
                    <VidCard2 key={trend.id} id={trend.id} title={trend.name} coverImage={trend.poster} type={trend.rank} />
                    ))
                }
            </Slider>
        </div>
        <br/><br/> 
        <div className="latest-episode-section">
            <div class="vl"><h3 className="Mont600" style={{color:"#fff", paddingLeft:"10px"}}>Latest Episodes</h3></div>
            <Link exact to={`/latest-episodes`} ><button className="view-more-btn">View More<ChevronRightRoundedIcon id="arrow-Icon"/></button></Link>
        </div>
        
        <br/>
        <div className="alignCardMargin2">
            {recentEp.map((recentEp) => (
                <VidCard3 key={recentEp.id} id={recentEp.id} title={recentEp.name} coverImage={recentEp.poster} currentEpisode={recentEp.episodes.sub} type={recentEp.type} duration={recentEp.duration}/>
                ))
            }
        </div>
        <br/><br/>
        <div className="AnimePromotion">
            <Link to="/details/solo-leveling-18718">
                <img
                    src="https://i.postimg.cc/HkyBJQp2/Solo-Leveling-Watch-Now-AD.png"
                    alt="Anime Promotion"
                    className="AnimePromotionImg"
                />
            </Link>
        </div>
        <br/><br/>
        <div class="vl"><h3 className="Mont600" style={{color:"#fff", paddingLeft:"10px"}}>Top Airing</h3></div>
        <br/>
        <div className="alignCardMargin">
            <Slider {...settings}>
            {topAiring.map((movie) => (
                    <VidCard2 key={movie.id} id={movie.id} title={movie.name} coverImage={movie.poster} type={movie.otherInfo[0]} />
                    ))
                }
            </Slider>
        </div>
        <br/><br/>
        <div class="vl"><h3 className="Mont600" style={{color:"#fff", paddingLeft:"10px"}}>Popular Anime This Month</h3></div>
        <br/>
        <div className="alignCardMargin">
            <Slider {...settings}>
            {top.map((movie) => (
                    <VidCard2 key={movie.id} id={movie.id} title={movie.name} coverImage={movie.poster} type={movie.rank} />
                    ))
                }
            </Slider>
        </div>
        <br/><br/>
        <div className="AnimePromotion">
            <Link to="/details/one-piece-100">
                <img
                    src="https://i.postimg.cc/9fMs7Zvk/One-Piece-Ad.png"
                    alt="Anime Promotion"
                    className="AnimePromotionImg"
                />
            </Link>
        </div>
        <br/><br/>
        <div class="vl"><h3 className="Mont600" style={{color:"#fff", paddingLeft:"10px"}}>Upcoming Anime</h3></div>
        <br/>
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