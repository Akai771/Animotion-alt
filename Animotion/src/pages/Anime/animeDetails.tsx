import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import DisplayCard from "@/components/cards/display-card";
import ReactPlayer from "react-player";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import WatchNowButton from "../../components/buttons/WatchNowButton";
import WatchlistButton from "../../components/buttons/WatchlistButton";
import { useIsMobile } from "@/hooks/use-mobile";
import Comment from "../../components/comment";

export default function AnimeDetails() {
    const [animeData, setAnimeData] = useState<any>(null);
    const [trailerData, setTrailerData] = useState<any>(null);
    const [addData, setAddData] = useState<any>(null);
    const [recommend, setRecommend] = useState<any>([]);
    const [recommendPop, setRecommendPop] = useState<any>([]);
    const [episode, setEpisode] = useState<any>(null);
    const isMobile = useIsMobile();
    const playerWidth = 400;
    const playerHeight = 225;
    
    const { id } = useParams();
    const navigate = useNavigate();

    const handleGenreRedirect = (genre: string) => {
        const newGenre = genre.split(" ").join("-").toLowerCase();
        navigate(`/genre/${newGenre}`);
    };

    useEffect(() => {
        axios.get(`${import.meta.env.VITE_API}/api/v2/hianime/anime/${id}`).then((res) => {
        setAnimeData(res.data.data.anime.info);
        setTrailerData(res.data.data.anime.info.promotionalVideos?.[0]);
        setAddData(res.data.data.anime.moreInfo);
        setRecommend(res.data.data.seasons);
        setRecommendPop(res.data.data.mostPopularAnimes);
        });

        axios.get(`${import.meta.env.VITE_API}/api/v2/hianime/anime/${id}/episodes`).then((res) => {
        setEpisode(res.data.data.episodes?.[0]?.episodeId);
        });

        window.scrollTo(0, 0);
    }, [id]);

    // Desktop slider settings - preserving original
    var settings = {
        dots: true,
        infinite: true,
        speed: 400,
        slidesToShow: 7,
        slidesToScroll: 1,
        swipeToSlide: true,
    };

    // Mobile slider settings
    const mobileSettings = {
        dots: true,
        infinite: true,
        speed: 400,
        slidesToShow: 2,
        slidesToScroll: 1,
        swipeToSlide: true,
    };

    if (isMobile) {
        // Mobile layout
        return (
            <div className="flex flex-col items-center justify-center w-full min-h-screen bg-[--background] text-[--text-color] p-3 mt-10">
                {/* Anime Details Section */}
                <Card className="w-full max-w-[90dvw] shadow-lg p-3">
                    {animeData ? (
                    <>
                        <CardHeader className="flex flex-col gap-4 justify-between">
                            <div className="flex flex-col gap-4">
                                <img
                                    src={animeData.poster || "https://via.placeholder.com/150x190"}
                                    alt="Anime Cover"
                                    className="w-full h-auto object-cover rounded-lg" />
                                <div className="flex flex-col justify-between">
                                    <CardTitle className="text-xl font-bold">{animeData.name}</CardTitle>
                                    <div className="flex flex-wrap gap-2 text-xs mt-2">
                                        <Badge>{animeData.stats?.rating || "No Data"}</Badge>
                                        <Badge>{animeData.stats?.type || "No Data"}</Badge>
                                        <Badge>{addData?.duration || "No Data"}</Badge>
                                    </div>
                                    <span className="text-xs text-gray-400 mt-2">Other Titles: {addData?.japanese || "No Title"}</span>
                                    <div className="mt-2">
                                        <span className="font-semibold">Genres: </span>
                                        <div className="flex flex-wrap gap-1 mt-1">
                                            {addData?.genres
                                                ? addData.genres.map((genre: string) => (
                                                    <Button
                                                        key={genre}
                                                        variant="outline"
                                                        className="text-xs px-2 py-1 mr-1 mb-1 h-auto"
                                                        onClick={() => handleGenreRedirect(genre)}
                                                    >
                                                        {genre}
                                                    </Button>
                                                ))
                                                : "No Data"}
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-x-2 gap-y-1 mt-3 text-xs">
                                        <span className="font-bold">Release Date: <span className="font-normal">{addData?.aired || "No Data"}</span></span>
                                        <span className="font-bold">Status: <span className="font-normal">{addData?.status || "No Data"}</span></span>
                                        <span className="font-bold">Episodes: <span className="font-normal">{animeData.stats?.episodes?.sub || "0"}</span></span>
                                        <span className="font-bold">MAL Score: <span className="font-normal">{addData?.malscore || "No Data"}</span></span>
                                        <span className="font-bold">Studio: <span className="font-normal">{addData?.studios || "No Data"}</span></span>
                                    </div>
                                </div>
                            </div>
                            <div className="w-full mt-4">
                                {trailerData && (
                                    <ReactPlayer 
                                        width="100%" 
                                        height={200} 
                                        url={trailerData.source} 
                                    />
                                )}
                            </div>
                        </CardHeader>

                        <CardContent>
                            {/* Synopsis */}
                            <div className="mt-5 w-full">
                                <span className="text-xl font-semibold">Synopsis:</span>
                                <p className="text-sm mt-2 text-justify">{animeData.description}</p>
                            </div>

                            {/* Watch Buttons */}
                            <div className="mt-4 flex gap-3">
                                <WatchNowButton animeId={animeData.id} animeTitle={animeData.name} animeImage={animeData.poster} animeEpisode={episode} />
                                <WatchlistButton animeId={animeData.id} animeTitle={animeData.name} animeImage={animeData.poster} />
                            </div>
                        </CardContent>
                    </>
                    ) : (
                        <Skeleton className="w-full h-96 rounded-lg" />
                    )}
                </Card>

                {/* Season Section */}
                {recommend.length > 0 && (
                <Card className="w-full max-w-[90dvw] shadow-lg p-3 mt-5">
                    <CardTitle className="text-xl font-semibold mb-2">Seasons:</CardTitle>
                    <div className="mt-3">
                        <Slider {...mobileSettings}>
                            {(recommend.slice(0, 7)).map((season: any) => (
                                <div key={season.id} className="px-1">
                                    <DisplayCard id={season.id} title={season.name} type={season.type} coverImage={season.poster} />
                                </div>
                            ))}
                        </Slider>
                    </div>
                </Card>
                )}

                {/* Recommended Section */}
                {recommendPop.length > 0 && (
                <Card className="w-full max-w-[90dvw] shadow-lg p-3 mt-5">
                    <CardTitle className="text-xl font-semibold mb-2">Recommended for you:</CardTitle>
                    <div className="mt-3">
                        <Slider {...mobileSettings}>
                            {recommendPop.map((season: any) => (
                                <div key={season.id} className="px-1">
                                    <DisplayCard id={season.id} title={season.name} type={season.type} coverImage={season.poster} />
                                </div>
                            ))}
                        </Slider>
                    </div>
                </Card>
                )}

                {/* Comments Section */}
                <Card className="w-full max-w-[90dvw] shadow-lg p-3 mt-5">
                    <CardTitle className="text-xl font-semibold mb-2">Comments:</CardTitle>
                    <Comment animeId={id!} />
                </Card>
            </div>
        );
    }

    // Desktop layout - preserved exactly as original
    return (
        <div className="flex flex-col items-center justify-center w-full min-h-screen bg-[--background] text-[--text-color] p-5 mt-10">
            {/* Anime Details Section */}
            <Card className="w-full max-w-[90dvw] shadow-lg p-5">
                {animeData ? (
                <>
                    <CardHeader className="flex flex-row gap-6 justify-between">
                        <div className="flex flex-row gap-6">
                            <img
                                src={animeData.poster || "https://via.placeholder.com/150x190"}
                                alt="Anime Cover"
                                className="w-48 h-64 object-cover rounded-lg" />
                            <div className="flex flex-col justify-between">
                                <CardTitle className="text-2xl font-bold">{animeData.name}</CardTitle>
                                <div className="flex gap-3 text-sm">
                                    <Badge>{animeData.stats?.rating || "No Data"}</Badge>
                                    <Badge>{animeData.stats?.type || "No Data"}</Badge>
                                    <Badge>{addData?.duration || "No Data"}</Badge>
                                </div>
                                <span className="text-sm text-gray-400">Other Titles: {addData?.japanese || "No Title"}</span>
                                <div className="mt-2">
                                    <span className="font-semibold">Genres: </span>
                                    {addData?.genres
                                        ? addData.genres.map((genre: string) => (
                                            <Button
                                                key={genre}
                                                variant="outline"
                                                className="text-xs px-2 py-1 mr-2"
                                                onClick={() => handleGenreRedirect(genre)}
                                            >
                                                {genre}
                                            </Button>
                                        ))
                                        : "No Data"}
                                </div>
                                <span className="text-sm font-bold">Release Date: <span className="font-normal">{addData?.aired || "No Data"}</span></span>
                                <span className="text-sm font-bold">Status: <span className="font-normal">{addData?.status || "No Data"}</span></span>
                                <span className="text-sm font-bold">Episodes: <span className="font-normal">{animeData.stats?.episodes?.sub || "0"}</span></span>
                                <span className="text-sm font-bold">MAL Score: <span className="font-normal">{addData?.malscore || "No Data"}</span></span>
                                <span className="text-sm font-bold">Studio: <span className="font-normal">{addData?.studios || "No Data"}</span></span>
                            </div>
                        </div>
                        <div>
                            {trailerData && (
                                <ReactPlayer width={playerWidth} height={playerHeight} url={trailerData.source} />
                            )}
                        </div>
                    </CardHeader>

                    <CardContent>
                        {/* Synopsis */}
                        <div className="mt-5 w-3/4">
                            <span className="text-xl font-semibold">Synopsis:</span>
                            <p className="text-sm mt-2 text-justify">{animeData.description}</p>
                        </div>

                        {/* Watch Buttons */}
                        <div className="mt-4 flex gap-3">
                            <WatchNowButton animeId={animeData.id} animeTitle={animeData.name} animeImage={animeData.poster} animeEpisode={episode} />
                            <WatchlistButton animeId={animeData.id} animeTitle={animeData.name} animeImage={animeData.poster} />
                        </div>
                    </CardContent>
                </>
                ) : (
                    <Skeleton className="w-full h-96 rounded-lg" />
                )}
            </Card>

            {/* Season Section */}
            {recommend.length > 0 && (
            <Card className="w-full max-w-[90dvw] shadow-lg p-5 mt-5">
                <CardTitle className="text-xl font-semibold">Seasons:</CardTitle>
                <div className="mt-3">
                    <div className="flex flex-row gap-5">
                        {(recommend.slice(0, 7)).map((season: any) => (
                            <DisplayCard key={season.id} id={season.id} title={season.name} type={season.type} coverImage={season.poster} />
                        ))}
                    </div>
                </div>
            </Card>
            )}

            {/* Recommended Section */}
            {recommendPop.length > 0 && (
            <Card className="w-full max-w-[90dvw] shadow-lg p-5 mt-5">
                <CardTitle className="text-xl font-semibold">Recommended for you:</CardTitle>
                <div className="mt-3">
                    <Slider {...settings}>
                        {recommendPop.map((season: any) => (
                            <DisplayCard key={season.id} id={season.id} title={season.name} type={season.type} coverImage={season.poster} />
                        ))}
                    </Slider>
                </div>
            </Card>
            )}

            {/* Comments Section */}
            <Card className="w-full max-w-[90dvw] shadow-lg p-5 mt-5">
                <CardTitle className="text-xl font-semibold">Comments:</CardTitle>
                <Comment animeId={id!} />
            </Card>
        </div>
    );
}