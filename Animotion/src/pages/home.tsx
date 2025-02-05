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

  interface History {
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
  const [loading, setLoading] = useState(true);

  const handleResize = () => {
    setScreenWidth(window.innerWidth);
  };

  useEffect(() => {
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  useEffect(() => {
    axios.get(`${import.meta.env.VITE_API}/api/v2/hianime/home`)
      .then((res) => {
        setRecentEp(res.data.data.latestEpisodeAnimes);
        setTrending(res.data.data.trendingAnimes);
        setTopAiring(res.data.data.topAiringAnimes);
        setUpcoming(res.data.data.topUpcomingAnimes);
        setTop(res.data.data.top10Animes.month);
      })
      .catch((err) => console.log(err))
      .finally(() => setLoading(false));

    window.scrollTo(0,0);
  }, []);

  useEffect(() => {
    const contWatchingData = localStorage.getItem("history");
    if (contWatchingData) {
      try {
        setContWatching(JSON.parse(contWatchingData));
      } catch (error) {
        console.error("Error parsing history from localStorage:", error);
      }
    }
  }, []);

  const contWatchingReversed = contWatching ? contWatching.reverse() : null;

  return (
    <div className="flex flex-col items-center justify-center w-full h-full gap-10 mt-16">
      
      {/* Carousel Section */}
      <section>
        {loading ? (
          <Skeleton className="w-[90dvw] h-[40vh] rounded-lg" />
        ) : (
          <CarouselMain />
        )}
      </section>

      <section className="flex flex-col items-start justify-center w-[90dvw] h-full gap-10 mb-10">
        
        {/* Trending Section */}
        <div id="Trending" className="w-full">
          <div className="flex gap-5 items-center">
            <div className="border border-l-4 border-[--primary-color] h-10" />
            <span className="font-bold text-4xl text-[--text-color]">Trending</span>
          </div>
          <div className="mt-5">
            {loading ? (
              <div className="flex gap-4">
                {[...Array(5)].map((_, index) => (
                  <Skeleton key={index} className="w-[150px] h-[220px] rounded-lg" />
                ))}
              </div>
            ) : (
              <Slider dots infinite speed={400} slidesToShow={4} slidesToScroll={2}>
                {trending.map((trend) => (
                  <TrendingCard key={trend.id} id={trend.id} title={trend.name} coverImage={trend.poster} type={trend.rank} />
                ))}
              </Slider>
            )}
          </div>
        </div>
        
        <Separator />

        {/* Advertisement Section */}
        <div id="Advertisement" className="flex flex-col items-center justify-center w-full h-full">
          {loading ? (
            <Skeleton className="w-[70dvw] h-[35dvh] rounded-lg" />
          ) : (
            <AdvCard imageUrl="https://i.postimg.cc/j5cQSLbp/Anime-APK-AD-Cropped.png" link={import.meta.env.VITE_APK} />
          )}
        </div>

        <Separator />

        {/* Continue Watching Section */}
        <div id="Continue-Watching" className="w-full">
          <div className="flex gap-5 items-center">
            <div className="border border-l-4 border-[--primary-color] h-10" />
            <span className="font-bold text-4xl text-[--text-color]">Continue Watching</span>
          </div>
          <div className="mt-5 flex flex-wrap gap-5">
            {loading ? (
              [...Array(4)].map((_, index) => (
                <Skeleton key={index} className="w-[150px] h-[200px] rounded-lg" />
              ))
            ) : contWatchingReversed ? (
              contWatchingReversed.slice(0, 4).map((cont) => (
                <ContWatchingCard key={cont.animeId} id={cont.animeId} title={cont.animeTitle} coverImage={cont.animeImage} currentEpisode={cont.animeEpisodeId} />
              ))
            ) : (
              <span className="bg-[#161616] max-w-xs p-8 rounded-lg font-semibold text-md">Start Watching to see your history here!</span>
            )}
          </div>
        </div>

        <Separator />

        {/* Recent Episodes */}
        <div id="RecentEpisodes" className="w-full">
          <div className="flex gap-5 items-center">
            <div className="border border-l-4 border-[--primary-color] h-10" />
            <span className="font-bold text-4xl text-[--text-color]">Recent Episodes</span>
          </div>
          <div className="mt-5 flex flex-wrap gap-5">
            {loading ? (
              [...Array(5)].map((_, index) => (
                <Skeleton key={index} className="w-[150px] h-[220px] rounded-lg" />
              ))
            ) : (
              recentEp.map((recent) => (
                <DisplayCard key={recent.id} id={recent.id} title={recent.name} coverImage={recent.poster} currentEpisode={recent.episodes?.sub || "N/A"} type={recent.type} duration={recent.duration} />
              ))
            )}
          </div>
        </div>

        <Separator />

      </section>
    </div>
  );
}
