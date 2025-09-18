import React, { useState, useEffect } from "react";
import {
  useParams,
  useSearchParams,
  useNavigate,
  Link,
} from "react-router-dom";
import axios from "axios";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Rewind, FastForward, Mic, Captions, Server, Info, Search, FilterX } from "lucide-react";
import VideoPlayer from "../../components/video-player";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import DisplayCard from "@/components/cards/display-card";
import { useIsMobile } from "@/hooks/use-mobile";
import { Helmet } from "react-helmet-async";

// Define types for episodes & anime
interface Episode {
  episodeId: string;
  number: number;
  title?: string;
  isFiller?: boolean;
}

interface ServerInfo {
  episodeNo: number;
  dub?: string[];
  sub?: string[];
}

interface AnimeData {
  id?: string;
  name?: string;
  poster?: string;
  description?: string;
  stats?: { duration: string; rating: string; type: string };
}

const AnimePlayer: React.FC = () => {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const defaultEpisodeId = `${id}-episode-1`;
  const histEpisodeId = searchParams.get("epId") || defaultEpisodeId;
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  const [animeData, setAnimeData] = useState<AnimeData | null>(null);
  const [serverInfo, setServerInfo] = useState<ServerInfo | null>(null);
  const [serverLink, setServerLink] = useState<any>(null);
  const [serverUrl, setServerUrl] = useState("");
  const [episodeList, setEpisodeList] = useState<Episode[]>([]);
  const [filteredEpisodes, setFilteredEpisodes] = useState<Episode[]>([]);
  const [selectedEpisode, setSelectedEpisode] = useState(histEpisodeId);
  const [recommendPop, setRecommendPop] = useState<AnimeData[]>([]);

  // Search and filter states
  const [searchTerm, setSearchTerm] = useState("");
  const [showFillerOnly, setShowFillerOnly] = useState(false);
  const [hideFillers, setHideFillers] = useState(false);

  // NEW: Manage server & format in state
  const [server, setServer] = useState<"hd-1" | "hd-2">("hd-2");
  const [format, setFormat] = useState<"sub" | "dub">("sub");

  // One-time effect to read server & format preferences from localStorage
  useEffect(() => {
    const storedServer = localStorage.getItem("server");
    const storedFormat = localStorage.getItem("format");
    if (storedServer === "hd-2") setServer("hd-2");
    if (storedFormat === "dub") setFormat("dub");
  }, []);

  // Effect to store server & format changes in localStorage
  useEffect(() => {
    localStorage.setItem("server", server);
    localStorage.setItem("format", format);
  }, [server, format]);

  // Filter episodes based on search term and filter settings
  useEffect(() => {
    if (!episodeList.length) return;
    
    let filtered = [...episodeList];
    
    // Apply search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        episode => 
          episode.title?.toLowerCase().includes(term) || 
          episode.number.toString().includes(term)
      );
    }
    
    // Apply filler filters
    if (showFillerOnly) {
      filtered = filtered.filter(episode => episode.isFiller);
    } else if (hideFillers) {
      filtered = filtered.filter(episode => !episode.isFiller);
    }
    
    setFilteredEpisodes(filtered);
  }, [searchTerm, showFillerOnly, hideFillers, episodeList]);

  // Clear all filters
  const clearFilters = () => {
    setSearchTerm("");
    setShowFillerOnly(false);
    setHideFillers(false);
  };

  // Update Episode History in localStorage
  const updateEpisodeHistory = (animeId: string, episodeId: string) => {
    const historyData = localStorage.getItem("history");
    let parsedHistory = historyData ? JSON.parse(historyData) : [];

    if (Array.isArray(parsedHistory)) {
      const targetIndex = parsedHistory.findIndex(
        (anime: { animeId: string }) => anime.animeId === animeId
      );

      if (targetIndex !== -1) {
        parsedHistory[targetIndex].animeEpisodeId = episodeId;
      } else {
        parsedHistory.push({ animeId, animeEpisodeId: episodeId });
      }

      localStorage.setItem("history", JSON.stringify(parsedHistory));
    } else {
      console.error("Invalid data format in 'history'");
    }
  };

  // Fetch anime info & episode list
  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_API}/api/v2/hianime/anime/${id}/episodes`)
      .then((res) => {
        setEpisodeList(res.data.data.episodes);
        setFilteredEpisodes(res.data.data.episodes);
      });

    axios
      .get(`${import.meta.env.VITE_API}/api/v2/hianime/anime/${id}`)
      .then((res) => {
        setAnimeData(res.data.data.anime.info);
        setRecommendPop(res.data.data.seasons);
      });

    window.scrollTo(0, 0);
  }, [id]);

  // Fetch episode data (server info + sources)
  useEffect(() => {
    axios
      .get(
        `${
          import.meta.env.VITE_API
        }/api/v2/hianime/episode/servers?animeEpisodeId=${selectedEpisode}`
      )
      .then((res) => setServerInfo(res.data.data))
      .catch((err) => console.error("Error fetching server data:", err));

    axios
      .get(`${import.meta.env.VITE_API}/api/v2/hianime/episode/sources?animeEpisodeId=${selectedEpisode}&server=${server}&category=${format}`,{
        headers: {
          "Referer": "https://megacloud.club/",
        }
      })
      .then((res) => {
        setServerUrl(res.data.data.sources[0].url);
        setServerLink(res.data.data);
      })
      .catch((err) => console.error("Error fetching server URL:", err));

    updateEpisodeHistory(id as string, selectedEpisode);
  }, [selectedEpisode, server, format, id]);

  // Handle next and previous episode navigation
  const handleNextEp = () => {
    if (!serverInfo) return;
    const nextEp = episodeList[serverInfo.episodeNo]?.episodeId;
    if (nextEp) {
      navigate(`/watch/${id}?epId=${nextEp}`);
      setSelectedEpisode(nextEp);
    }
  };
  

  const handlePrevEp = () => {
    if (!serverInfo) return;
    const prevEp = episodeList[serverInfo.episodeNo - 2]?.episodeId;
    if (prevEp) {
      navigate(`/watch/${id}?epId=${prevEp}`);
      setSelectedEpisode(prevEp);
    }
  };

  const checkHasNextEpisode = (): boolean => {
    if (!serverInfo || !episodeList.length) return false;
    const nextEpIndex = serverInfo.episodeNo;
    return nextEpIndex < episodeList.length;
  };

  // NEW: Function to get next episode info
  const getNextEpisodeInfo = () => {
    if (!serverInfo || !episodeList.length || !animeData) return undefined;
    
    const nextEpIndex = serverInfo.episodeNo; // This gives us the next episode index (0-based)
    const nextEpisode = episodeList[nextEpIndex];
    
    if (!nextEpisode) return undefined;

    return {
      title: nextEpisode.title || `${animeData.name}`,
      episode: `Episode ${nextEpisode.number}`,
      duration: animeData.stats?.duration || "24m",
      thumbnail: animeData.poster || "https://placehold.jp/320x192.png?text=Next+Episode"
    };
  };
  
  const hasDub = serverInfo?.dub && serverInfo.dub.length > 0;
  const hasFillers = episodeList.some(ep => ep.isFiller);

  const getProxiedTracks = (tracks: any[]) => {
  if (!tracks || !serverLink?.headers?.Referer) return tracks;
  
  return tracks.map(track => ({
    ...track,
    url: `${import.meta.env.VITE_PROXY_URL}/m3u8-proxy?url=${encodeURIComponent(track.url)}&referer=${encodeURIComponent(serverLink.headers.Referer)}`
  }));
};

  // Episode List Search Box Component
  const EpisodeSearchBox = () => (
    <div className="mb-4 space-y-2">
      <div className="relative">
        <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
        <Input
          placeholder="Search by episode number or title..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-8"
        />
        {searchTerm && (
          <Button 
            variant="ghost" 
            className="absolute right-1 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0"
            onClick={() => setSearchTerm("")}
          >
            <FilterX className="h-4 w-4" />
          </Button>
        )}
      </div>
      
      {hasFillers && (
        <div className="flex flex-wrap gap-4 h-10">
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="hide-fillers" 
              checked={hideFillers} 
              onCheckedChange={() => {
                setHideFillers(!hideFillers);
                if (!hideFillers) setShowFillerOnly(false);
              }}
            />
            <label htmlFor="hide-fillers" className="text-sm font-medium leading-none cursor-pointer">
              Hide Fillers
            </label>
          </div>
          
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="show-fillers-only" 
              checked={showFillerOnly} 
              onCheckedChange={() => {
                setShowFillerOnly(!showFillerOnly);
                if (!showFillerOnly) setHideFillers(false);
              }}
            />
            <label htmlFor="show-fillers-only" className="text-sm font-medium leading-none cursor-pointer">
              Show Fillers Only
            </label>
          </div>
          
          {(searchTerm || showFillerOnly || hideFillers) && (
            <>
              {isMobile ? (
                <Button variant="destructive" size="icon" onClick={clearFilters} className="ml-auto">
                  <FilterX className="h-4 w-4 mr-1" />
                </Button>
                ):(
                <Button variant="outline" size="sm" onClick={clearFilters} className="ml-auto">
                  <FilterX className="h-4 w-4 mr-1" /> Clear Filters
                </Button>
              )}
            </>
            
          )}
        </div>
      )}
      
      <div className="flex justify-between items-center text-sm">
        <span className="text-gray-400">
          {filteredEpisodes.length} of {episodeList.length} episodes
        </span>
        {searchTerm && (
          <span className="text-gray-400">
            Search results for: "{searchTerm}"
          </span>
        )}
      </div>
    </div>
  );

  if (isMobile) {
    // Mobile layout
    return (
      <div className="flex flex-col items-center justify-center max-w-8xl w-[100dvw] min-h-screen bg-[--background] text-[--text-color] p-3">
        <Helmet>
            <title>{animeData ? `Watching ${animeData.name} Episode ${serverInfo?.episodeNo} on Animotion` : 'Loading... - Animotion'}</title>
            <meta name="description" content={animeData ? `Watch ${animeData.name} Episode ${serverInfo?.episodeNo}. ${animeData.description}` : 'Loading...'} />
            <meta property="og:title" content={animeData ? `Watch Episode ${serverInfo?.episodeNo} of ${animeData.name} on Animotion` : 'Loading... - Animotion'} />
            <meta property="og:description" content={animeData ? `${animeData.description}` : 'Loading...'} />
            <meta property="og:image" content={animeData ? animeData.poster : 'https://via.placeholder.com/150x190'} />
        </Helmet>
        
        {/* Video Player Section */}
        <div className="w-full flex flex-col items-start justify-start pt-14 gap-3">
          <Card className="w-full p-3">
            <VideoPlayer
              serverLink={`${import.meta.env.VITE_PROXY_URL}/m3u8-proxy?url=${serverUrl}`}
              mal={serverLink ? serverLink.malID : null}
              trackSrc={getProxiedTracks(serverLink?.tracks || [])}
              thumbnails={serverLink?.tracks?.[1]?.file || ""}
              intro={serverLink?.intro}
              outro={serverLink?.outro}
              onNextEpisode={handleNextEp}
              hasNextEpisode={checkHasNextEpisode()}
              nextEpisodeInfo={getNextEpisodeInfo()}
            />

            <Card className="flex flex-col items-start gap-3 p-2 mt-3">
              {/* Current Episode */}
              <div className="flex flex-row gap-3 items-center w-full">
                <div className="flex flex-col w-32 items-start justify-center">
                  <span className="text-xs font-light text-neutral-500">
                    Current Episode:
                  </span>
                  <span className="text-lg w-full truncate font-bold text-[--text-color]">
                    Episode {serverInfo?.episodeNo}
                  </span>
                </div>
                <div className="border border-l-1 h-10 mx-2" />
                <div className="flex flex-row gap-2">
                  <Button
                    onClick={handlePrevEp}
                    disabled={!serverInfo}
                    size="sm"
                  >
                    <Rewind size={16} /> Prev
                  </Button>
                  <Button
                    onClick={handleNextEp}
                    disabled={!serverInfo}
                    size="sm"
                  >
                    Next <FastForward size={16} />
                  </Button>
                </div>
              </div>

              {/* Server & Format Controls */}
              <Card className="flex flex-col gap-2 p-2 bg-[--bgColor3] w-full">
                <div className="flex flex-col items-start">
                  <span className="text-xs font-light text-neutral-500">
                    Server:
                  </span>
                  <div className="flex flex-row items-center gap-2 mt-1">
                    <Button
                      variant="outline"
                      onClick={() => setServer("hd-1")}
                      className={`${
                        server === "hd-1"
                          ? "bg-[--primary-color] text-white"
                          : ""
                      } text-xs px-2 py-1 h-8`}
                      size="sm"
                    >
                      <Server size={14} className="mr-1" />
                      HD-1
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => setServer("hd-2")}
                      className={`${
                        server === "hd-2"
                          ? "bg-[--primary-color] text-white"
                          : ""
                      } text-xs px-2 py-1 h-8`}
                      size="sm"
                    >
                      <Server size={14} className="mr-1" />
                      HD-2
                    </Button>
                  </div>
                </div>
                <div className="flex flex-col items-start">
                  <span className="text-xs font-light text-neutral-500">
                    Formats:
                  </span>
                  <div className="flex flex-row items-center gap-2 mt-1">
                    <Button
                      variant="outline"
                      onClick={() => setFormat("sub")}
                      className={`${
                        format === "sub"
                          ? "bg-[--primary-color] text-white"
                          : ""
                      } text-xs px-2 py-1 h-8`}
                      size="sm"
                    >
                      <Captions size={14} className="mr-1" /> Sub
                    </Button>
                    {hasDub && (
                      <Button
                        variant="outline"
                        onClick={() => setFormat("dub")}
                        className={`${
                          format === "dub"
                            ? "bg-[--primary-color] text-white"
                            : ""
                        } text-xs px-2 py-1 h-8`}
                        size="sm"
                      >
                        <Mic size={14} className="mr-1" /> Dub
                      </Button>
                    )}
                  </div>
                </div>
              </Card>
            </Card>
          </Card>

          {/* Episodes List */}
          <Card className="w-full shadow-lg p-3">
            <span className="text-lg font-bold flex flex-row items-center justify-between w-full mb-2">
              Episodes List:
              <Badge className="text-neutral-500 text-xs font-semibold">
                {episodeList.length} Episodes
              </Badge>
            </span>
            
            {/* Episode Search and Filter */}
            <EpisodeSearchBox />
            
            <ScrollArea className="h-[40dvh]">
              {episodeList.length < 50 ? (
                <div className="grid grid-cols-1 gap-2">
                  {filteredEpisodes.map((ep) => (
                    <Button
                      key={ep.episodeId}
                      variant={
                        selectedEpisode === ep.episodeId ? "default" : "outline"
                      }
                      onClick={() => {
                        navigate(`/watch/${id}?epId=${ep.episodeId}`);
                        setSelectedEpisode(ep.episodeId);
                      }}
                      className={`w-full ${
                        ep.isFiller ? "bg-purple-500/10" : ""
                      } flex flex-row items-center justify-start h-auto py-2 text-xs`}
                    >
                      <span className="font-black text-neutral-500 mr-1">
                        {ep.number}.
                      </span>
                      <span className="w-5/6 truncate text-left">
                        {ep.title}
                      </span>
                      {ep.isFiller && (
                        <Badge variant="outline" className="ml-auto text-[10px] bg-purple-500/20">
                          Filler
                        </Badge>
                      )}
                    </Button>
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-4 gap-2">
                  {filteredEpisodes.map((ep) => (
                    <Button
                      key={ep.episodeId}
                      variant={
                        selectedEpisode === ep.episodeId ? "default" : "outline"
                      }
                      onClick={() => {
                        navigate(`/watch/${id}?epId=${ep.episodeId}`);
                        setSelectedEpisode(ep.episodeId);
                      }}
                      className={`w-full ${
                        ep.isFiller ? "bg-purple-500/10" : ""
                      } flex flex-row items-center justify-center p-0 h-8 text-xs`}
                    >
                      <span className="font-black text-neutral-500">
                        {ep.number}
                      </span>
                    </Button>
                  ))}
                </div>
              )}
              <ScrollBar />
            </ScrollArea>
          </Card>
        </div>

        {/* Anime Info */}
        {animeData && (
          <Card className="w-full shadow-lg p-3 mt-3">
            <div className="flex flex-col gap-3">
              <Link to={`/details/${id}`} className="block">
                <img
                  src={animeData.poster}
                  alt="Anime Cover"
                  className="w-full h-auto object-cover rounded-lg transition-all duration-100 ease-in-out hover:scale-95"
                />
              </Link>
              <div className="flex flex-col justify-start">
                <h2 className="text-2xl font-bold">{animeData.name}</h2>
                <div className="flex flex-wrap gap-2 mt-2 mb-3">
                  <Badge className="bg-red-500 text-white">
                    {animeData.stats?.rating || "N/A"}
                  </Badge>
                  <Badge className="bg-blue-500 text-white">
                    {animeData.stats?.type || "N/A"}
                  </Badge>
                  <Badge>{animeData.stats?.duration || "N/A"}</Badge>
                </div>
                <p className="text-gray-400 text-sm text-justify">
                  {animeData.description}
                </p>
              </div>
            </div>
          </Card>
        )}

        {/* Recommended Section (Seasons) */}
        {recommendPop.length > 0 && (
          <Card className="w-full shadow-lg p-3 mt-3">
            <h2 className="text-lg font-bold mb-2">Seasons:</h2>
            <div className="grid grid-cols-2 gap-2">
              {recommendPop.slice(0, 6).map((season) => (
                <DisplayCard
                  key={season.id}
                  id={season.id}
                  title={season.name}
                  coverImage={season.poster}
                />
              ))}
            </div>
          </Card>
        )}
      </div>
    );
  }

  // Desktop Layout
  return (
    <div className="flex flex-col items-center justify-center max-w-10xl w-full min-h-screen bg-[--background] text-[--text-color] p-5">
        <Helmet>
            <title>{animeData ? `Watching ${animeData.name} Episode ${serverInfo?.episodeNo} on Animotion` : 'Loading... - Animotion'}</title>
            <meta name="description" content={animeData ? `Watch ${animeData.name} Episode ${serverInfo?.episodeNo}. ${animeData.description}` : 'Loading...'} />
            <meta property="og:title" content={animeData ? `Watch Episode ${serverInfo?.episodeNo} of ${animeData.name} on Animotion` : 'Loading... - Animotion'} />
            <meta property="og:description" content={animeData ? `${animeData.description}` : 'Loading...'} />
            <meta property="og:image" content={animeData ? animeData.poster : 'https://via.placeholder.com/150x190'} />
        </Helmet>
        
      {/* Video Player Section */}
      <div className="w-full flex sm:!flex-col md:!flex-row items-start justify-start pt-10 gap-5 !important">
        <Card className="w-full p-5">
          <VideoPlayer
            serverLink={`${import.meta.env.VITE_PROXY_URL}/m3u8-proxy?url=${serverUrl}`}
            mal={serverLink ? serverLink.malID : null}
            trackSrc={getProxiedTracks(serverLink?.tracks || [])}
            thumbnails={serverLink?.tracks?.[1]?.file || ""}
            intro={serverLink?.intro}
            outro={serverLink?.outro}
            onNextEpisode={handleNextEp}
            hasNextEpisode={checkHasNextEpisode()}
            nextEpisodeInfo={getNextEpisodeInfo()}
          />
          <Card className="flex flex-row items-center justify-between p-2 mt-3">
            {/* Current Episode */}
            <div className="flex flex-row gap-5">
              <div className="flex flex-col items-start justify-center ml-2">
                <span className="text-xs font-light text-neutral-500">
                  Current Episode:
                </span>
                <span className="text-3xl font-bold text-[--text-color]">
                  Episode {serverInfo?.episodeNo}
                </span>
              </div>
              <div className="border border-l-1" />
              <Card className="flex flex-row gap-10 p-2 bg-[--bgColor3]">
                <div className="flex flex-col items-start">
                  <span className="text-xs font-light text-neutral-500">
                    Formats:
                  </span>
                  <div className="flex flex-row items-center gap-2">
                    <Button
                      variant="outline"
                      onClick={() => setFormat("sub")}
                      className={`${
                        format === "sub"
                          ? "bg-[--primary-color] text-white"
                          : ""
                      }`}
                    >
                      <Captions size={16} /> Sub
                    </Button>
                    {hasDub && (
                      <Button
                        variant="outline"
                        onClick={() => setFormat("dub")}
                        className={`${
                          format === "dub"
                            ? "bg-[--primary-color] text-white"
                            : ""
                        }`}
                      >
                        <Mic size={16} /> Dub
                      </Button>
                    )}
                  </div>
                </div>
                <div className="flex flex-col items-start">
                  <span className="text-xs font-light text-neutral-500">
                    Server:
                  </span>
                  <div className="flex flex-row items-center gap-2">
                    <Button
                      variant="outline"
                      onClick={() => setServer("hd-1")}
                      className={`${
                        server === "hd-1"
                          ? "bg-[--primary-color] text-white"
                          : ""
                      }`}
                    >
                      <Server size={16} />
                      HD-1
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => setServer("hd-2")}
                      className={`${
                        server === "hd-2"
                          ? "bg-[--primary-color] text-white"
                          : ""
                      }`}
                    >
                      <Server size={16} />
                      HD-2
                    </Button>
                  </div>
                </div>
              </Card>
              <Card className="flex flex-col w-80 gap-10 p-2 bg-[--bgColor3]">
                <div className="flex flex-row w-full h-full gap-2 items-center justify-center">
                  <span className="text-[--text-color3]"><Info /></span>
                  <span className="text-xs text-[--text-color3] font-light">
                    If your video doesn't load, click "Refresh Player" to reload it.
                  </span>
                </div>
              </Card>
            </div>

            {/* Episode Navigation */}
            <div className="flex flex-row gap-5">
              <div className="border border-l-1" />
              <div className="flex flex-col items-start">
                <span className="text-xs font-light text-neutral-500">
                  Navigation:
                </span>
                <div className="flex flex-row gap-2">
                  <Button onClick={handlePrevEp} disabled={!serverInfo}>
                    <Rewind size={16} /> Previous
                  </Button>
                  <Button onClick={handleNextEp} disabled={!serverInfo}>
                    Next <FastForward size={16} />
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        </Card>

        {/* Episodes List */}
        <Card className="w-full h-full max-w-md shadow-lg p-5">
          <span className="text-xl font-bold mb-3 flex flex-row items-center justify-between w-full">
            Episodes List:
            <Card className="text-neutral-500 text-xs font-semibold p-2">
              {episodeList.length} Episodes
            </Card>
          </span>

          {/* Episode Search and Filter */}
          <EpisodeSearchBox />
          
          <ScrollArea className="h-[65dvh]">
            {episodeList.length < 50 ? (
              <div className="grid grid-cols-1 gap-3">
                {filteredEpisodes.map((ep) => (
                  <Button
                    key={ep.episodeId}
                    variant={
                      selectedEpisode === ep.episodeId ? "default" : "outline"
                    }
                    onClick={() => {
                      navigate(`/watch/${id}?epId=${ep.episodeId}`);
                      setSelectedEpisode(ep.episodeId);
                    }}
                    className={`w-full ${
                      ep.isFiller ? "bg-purple-500/10" : ""
                    } flex flex-row items-center justify-start`}
                  >
                    <span className="font-black text-neutral-500 mr-2">
                      {ep.number}.
                    </span>
                    <span className="w-5/6 truncate text-left">{ep.title}</span>
                    {ep.isFiller && (
                      <Badge variant="outline" className="ml-auto text-xs bg-purple-500/20">
                        Filler
                      </Badge>
                    )}
                  </Button>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-6 gap-3">
                {filteredEpisodes.map((ep) => (
                  <Button
                    key={ep.episodeId}
                    variant={
                      selectedEpisode === ep.episodeId ? "default" : "outline"
                    }
                    onClick={() => {
                      navigate(`/watch/${id}?epId=${ep.episodeId}`);
                      setSelectedEpisode(ep.episodeId);
                    }}
                    className={`w-full ${
                      ep.isFiller ? "bg-purple-500/10" : ""
                    } flex flex-row items-center justify-center relative`}
                  >
                    <span className="font-black text-neutral-500">
                      {ep.number}
                    </span>
                    {ep.isFiller && (
                      <span className="absolute top-0 right-0 w-2 h-2 bg-purple-500 rounded-full"></span>
                    )}
                  </Button>
                ))}
              </div>
            )}
            <ScrollBar />
          </ScrollArea>
        </Card>
      </div>

      {/* Anime Info */}
      {animeData && (
        <Card className="w-full shadow-lg p-5 mt-5">
          <div className="flex gap-5">
            <Link to={`/details/${id}`}>
              <img
                src={animeData.poster}
                alt="Anime Cover"
                className="max-w-4xl object-cover rounded-lg transition-all duration-100 ease-in-out hover:scale-95"
              />
            </Link>
            <div className="flex flex-col justify-start">
              <h2 className="text-5xl font-bold">{animeData.name}</h2>
              <div className="flex flex-row gap-2 mt-2 mb-5">
                <Badge className="bg-red-500 text-white">
                  {animeData.stats?.rating || "N/A"}
                </Badge>
                <Badge className="bg-blue-500 text-white">
                  {animeData.stats?.type || "N/A"}
                </Badge>
                <Badge>{animeData.stats?.duration || "N/A"}</Badge>
              </div>
              <p className="text-gray-400 mt-2 text-justify">
                {animeData.description}
              </p>
            </div>
          </div>
        </Card>
      )}

      {/* Recommended Section (Seasons) */}
      {recommendPop.length > 0 && (
        <Card className="w-full max-w-10xl shadow-lg p-5 mt-5">
          <h2 className="text-xl font-bold mb-3">Seasons:</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
            {recommendPop.map((season) => (
              <DisplayCard
                key={season.id}
                id={season.id}
                title={season.name}
                coverImage={season.poster}
              />
            ))}
          </div>
        </Card>
      )}
    </div>
  );
};

export default AnimePlayer;