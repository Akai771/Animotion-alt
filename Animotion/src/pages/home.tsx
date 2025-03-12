import { useEffect, useState } from "react";
import "../styling/globals.css";
import { Separator } from "@/components/ui/separator";
import CarouselMain from "@/components/carousel";
import TrendingCard from "@/components/cards/trending-card";
import AdvCard from "@/components/cards/advertisement-card";
import DisplayCard from "@/components/cards/display-card";
import ContWatchingCard from "@/components/cards/contWatching-card";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";
import axios from "axios";
import { Skeleton } from "@/components/ui/skeleton";
import { useIsMobile } from "@/hooks/use-mobile";

export default function Home(){
  interface Anime {
    id: string;
    name: string;
    poster: string;
    rank: string;
    episodes?: { sub: any; };
    type?: string;
    duration?: string;
    currentText?: string;
  }

  interface History{
    animeId: string;
    animeTitle: string;
    animeImage: string;
    animeEpisodeId: string;
  }

  const [recentEp, setRecentEp] = useState<Anime[]>([]);
  const [upcoming, setUpcoming] = useState<Anime[]>([]);
  const [trending, setTrending] = useState<Anime[]>([]);
  const [top, setTop] = useState<Anime[]>([]);
  const [topAiring, setTopAiring] = useState<Anime[]>([]);
  const [screenWidth, setScreenWidth] = useState(window.innerWidth);
  const [contWatching, setContWatching] = useState<History[] | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const isMobile = useIsMobile();

  const handleResize = () => {
    setScreenWidth(window.innerWidth);
  };

  useEffect(() => {
    const contWatchingData = localStorage.getItem("history");
    if (contWatchingData) {
      try {
        setContWatching(JSON.parse(contWatchingData));
      } catch (error) {
        console.error("Error parsing history from localStorage:", error);
      }
    }

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
    
  }, []);

  const contWatchingReversed = contWatching ? [...contWatching].reverse() : [];

  useEffect(() => {
    if(!trending || !recentEp || !topAiring || !upcoming || !top){
      setLoading(true);
    }
    else{
      setLoading(false);
    }
  }, [trending, recentEp, topAiring, upcoming, top]);

  useEffect(() => {
    axios.get(`${import.meta.env.VITE_API}/api/v2/hianime/home`)
      .then((res) => {
          setRecentEp(res.data.data.latestEpisodeAnimes)
          setTrending(res.data.data.trendingAnimes)
          setTopAiring(res.data.data.topAiringAnimes)
          setUpcoming(res.data.data.topUpcomingAnimes)
          setTop(res.data.data.top10Animes.month)
      })

    window.scrollTo(0,0);
  }, [])

  // Configure Slider settings based on screen width
  const getSliderSettings = (isCompactView = false) => {
    if (isMobile) {
      return {
        dots: true,
        infinite: true,
        speed: 400,
        slidesToShow: isCompactView ? 2 : 1,
        slidesToScroll: isCompactView ? 2 : 1,
        swipeToSlide: true,
      };
    } else if (screenWidth < 1600) {
      return {
        dots: true,
        infinite: true,
        speed: 400,
        slidesToShow: isCompactView ? 5 : 4,
        slidesToScroll: 2,
        swipeToSlide: true,
      };
    } else {
      return {
        dots: isCompactView ? true : false,
        infinite: isCompactView ? true : false,
        speed: 400,
        slidesToShow: isCompactView ? 7 : 5,
        slidesToScroll: isCompactView ? 2 : 1,
        swipeToSlide: true,
      };
    }
  };

  const settings = getSliderSettings(true);
  const settings2 = getSliderSettings(false);

  return (<>
      {loading ? (
        <div className="flex flex-col items-center justify-center w-full h-full gap-10 mt-16">
          <Skeleton className="w-[90dvw] h-[50dvh]"/>
          <div className="flex flex-col gap-5 items-start justify-start w-[90dvw]">
            <Skeleton className="w-[90dvw] h-[10dvh]"/>
            <Skeleton className="w-[90dvw] h-[30dvh]"/>
          </div>
        </div>
      ) : (
      <div className="flex flex-col items-center justify-center w-full h-full gap-10 mt-16">
        <section className={isMobile ? "w-full" : ""}>
          <CarouselMain />
        </section>
        <section className="flex flex-col items-start justify-center w-[90dvw] h-full gap-10 mb-10">
          <div id="Trending" className="flex-col items-center justify-start w-full h-full">
            <div className="flex gap-5 items-center justify-start">
              <div className="border border-l-4 border-[--primary-color] h-10" />
              <span className={`font-bold ${isMobile ? "text-2xl" : "text-4xl"} text-[--text-color]`}>Trending</span>
            </div>
            <div className="mt-5">
              <Slider {...settings2}>
                {trending.map((trend) => (
                  <TrendingCard key={trend.id} id={trend.id} title={trend.name} coverImage={trend.poster} type={trend.rank} />
                ))}
              </Slider>
            </div>
          </div>
          <Separator />
          <div id="Advertisement" className="flex flex-col items-center justify-center w-full h-full">
            <AdvCard imageUrl="https://i.postimg.cc/j5cQSLbp/Anime-APK-AD-Cropped.png" link={import.meta.env.VITE_APK}/>
          </div>
          <Separator />
          <div id="Continue-Watching" className="flex-col items-center justify-start w-full h-full">
            <div className="flex gap-5 items-center justify-start">
              <div className="border border-l-4 border-[--primary-color] h-10" />
              <span className={`font-bold ${isMobile ? "text-2xl" : "text-4xl"} text-[--text-color]`}>Continue Watching</span>
            </div>
            {isMobile ? (
              <div className="mt-2 px-1">
                {contWatchingReversed.length > 0 ? (
                  <div className="space-y-2">
                    {contWatchingReversed.slice(0,4).map((cont) => (
                      <ContWatchingCard key={cont.animeId} id={cont.animeId} title={cont.animeTitle} coverImage={cont.animeImage} currentEpisode={cont.animeEpisodeId}/>
                    ))}
                  </div>
                ) : (
                  <div className="bg-[#161616] p-4 rounded-lg text-center mt-2">
                    <span className="font-semibold text-sm">Start Watching to see your history here!</span>
                  </div>
                )}
              </div>
            ) : (
              <div className="mt-5 flex flex-row items-center justify-start gap-10 max-w-[90dvw] flex-wrap">
                {contWatchingReversed.length > 0 ? contWatchingReversed.slice(0,4).map((cont) => (
                    <ContWatchingCard key={cont.animeId} id={cont.animeId} title={cont.animeTitle} coverImage={cont.animeImage} currentEpisode={cont.animeEpisodeId}/>
                )) : <span className="bg-[#161616] max-w-xs p-8 rounded-lg font-semibold text-md">Start Watching to see your history here!</span>}
              </div>
            )}
          </div>
          <Separator />
          <div id="RecentEpisodes" className="flex-col items-center justify-start w-full h-full">
            <div className="flex gap-5 items-center justify-start">
              <div className="border border-l-4 border-[--primary-color] h-10" />
              <span className={`font-bold ${isMobile ? "text-2xl" : "text-4xl"} text-[--text-color]`}>Recent Episodes</span>
            </div>
            {isMobile ? (
              <div className="mt-2 px-1">
                <div className="grid grid-cols-2 gap-1">
                  {recentEp.slice(0, 6).map((recentEp) => (
                    <DisplayCard 
                      key={recentEp.id} 
                      id={recentEp.id} 
                      title={recentEp.name} 
                      coverImage={recentEp.poster} 
                      currentEpisode={recentEp.episodes?.sub || "N/A"} 
                      type={recentEp.type} 
                      duration={recentEp.duration} 
                      currentText={"Episode"}
                    />
                  ))}
                </div>
              </div>
            ) : (
              <div className="mt-5 flex flex-row items-center justify-start gap-10 max-w-[90dvw] flex-wrap">
                {recentEp.map((recentEp) => (
                    <DisplayCard key={recentEp.id} id={recentEp.id} title={recentEp.name} coverImage={recentEp.poster} currentEpisode={recentEp.episodes?.sub || "N/A"} type={recentEp.type} duration={recentEp.duration} currentText={"Episode"}/>
                ))}
              </div>
            )}
          </div>
          <Separator />
          <div id="Advertisement" className="flex flex-col items-center justify-center w-full h-full">
            <AdvCard imageUrl="https://i.postimg.cc/5yc3rZf0/Dan-Da-Dan-Watch-Now-Ad.png" link="/details/dandadan-19319"/>
          </div>
          <Separator />
          <div id="Top-Airing" className="flex-col items-center justify-start w-full h-full">
            <div className="flex gap-5 items-center justify-start">
              <div className="border border-l-4 border-[--primary-color] h-10" />
              <span className={`font-bold ${isMobile ? "text-2xl" : "text-4xl"} text-[--text-color]`}>Top Airing</span>
            </div>
            <div className="mt-5">
              <Slider {...settings}>
                {topAiring.map((recentEp) => (
                    <DisplayCard key={recentEp.id} id={recentEp.id} title={recentEp.name} coverImage={recentEp.poster} currentEpisode={recentEp.episodes?.sub || "N/A"} type={recentEp.type} duration={recentEp.duration} currentText={"Total Episodes:"}/>
                ))}
              </Slider>
            </div>
          </div>
          <Separator />
          <div id="Top-Airing" className="flex-col items-center justify-start w-full h-full">
            <div className="flex gap-5 items-center justify-start">
              <div className="border border-l-4 border-[--primary-color] h-10" />
              <span className={`font-bold ${isMobile ? "text-2xl" : "text-4xl"} text-[--text-color]`}>Popular Anime This Month</span>
            </div>
            <div className="mt-5">
              <Slider {...settings}>
                {top.map((recentEp) => (
                    <DisplayCard key={recentEp.id} id={recentEp.id} title={recentEp.name} coverImage={recentEp.poster} currentEpisode={recentEp.episodes?.sub || "N/A"} type={recentEp.rank} duration={recentEp.duration} currentText={"Total Episodes:"}/>
                ))}
              </Slider>
            </div>
          </div>
          <Separator />
          <div id="Advertisement" className="flex flex-col items-center justify-center w-full h-full">
            <AdvCard imageUrl="https://i.postimg.cc/9fMs7Zvk/One-Piece-Ad.png" link="/details/one-piece-100"/>
          </div>
          <Separator />
          <div id="Top-Airing" className="flex-col items-center justify-start w-full h-full">
            <div className="flex gap-5 items-center justify-start">
              <div className="border border-l-4 border-[--primary-color] h-10" />
              <span className={`font-bold ${isMobile ? "text-2xl" : "text-4xl"} text-[--text-color]`}>Upcoming Anime</span>
            </div>
            <div className="mt-5">
              <Slider {...settings}>
                {upcoming.map((item) => (
                    <DisplayCard key={item.id} id={item.id} title={item.name} coverImage={item.poster} currentEpisode={item.type}/>
                ))}
              </Slider>
            </div>
          </div>
        </section>
      </div>
    )}
  </>);
}