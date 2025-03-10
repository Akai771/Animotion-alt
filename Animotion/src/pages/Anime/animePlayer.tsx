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
import { Rewind, FastForward, Mic, Captions, Server } from "lucide-react";
import VideoPlayer from "../../components/video-player";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import DisplayCard from "@/components/cards/display-card";
import { useIsMobile } from "@/hooks/use-mobile";

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
  const [selectedEpisode, setSelectedEpisode] = useState(histEpisodeId);
  const [recommendPop, setRecommendPop] = useState<AnimeData[]>([]);

  // NEW: Manage server & format in state
  const [server, setServer] = useState<"hd-1" | "hd-2">("hd-1");
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
      .get(
        `${
          import.meta.env.VITE_API
        }/api/v2/hianime/episode/sources?animeEpisodeId=${selectedEpisode}&server=${server}&category=${format}`
      )
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
  const hasDub = serverInfo?.dub && serverInfo.dub.length > 0;

  if (isMobile) {
    // Mobile layout
    return (
      <div className="flex flex-col items-center justify-center max-w-10xl w-full min-h-screen bg-[--background] text-[--text-color] p-3">
        {/* Video Player Section */}
        <div className="w-full flex flex-col items-start justify-start pt-10 gap-3">
          <Card className="w-full p-3">
            <VideoPlayer
              serverLink={serverUrl}
              mal={serverLink ? serverLink.malID : null}
              trackSrc={serverLink?.tracks || []}
              thumbnails={serverLink?.tracks?.[1]?.file || ""}
            />

            <Card className="flex flex-col items-start gap-3 p-2 mt-3">
              {/* Current Episode */}
              <div className="flex flex-row gap-3 items-center w-full">
                <div className="flex flex-col items-start justify-center">
                  <span className="text-xs font-light text-neutral-500">
                    Current Episode:
                  </span>
                  <span className="text-2xl font-bold text-[--text-color]">
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
            <span className="text-lg font-bold mb-2 flex flex-row items-center justify-between w-full">
              Episodes List:
              <Badge className="text-neutral-500 text-xs font-semibold">
                {episodeList.length} Episodes
              </Badge>
            </span>
            <ScrollArea className="h-[40dvh] mt-2">
              {episodeList.length < 50 ? (
                <div className="grid grid-cols-1 gap-2">
                  {episodeList.map((ep) => (
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
                    </Button>
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-4 gap-2">
                  {episodeList.map((ep) => (
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

  // Original Desktop Layout (unchanged)
  return (
    <div className="flex flex-col items-center justify-center max-w-10xl w-full min-h-screen bg-[--background] text-[--text-color] p-5">
      {/* Video Player Section */}
      <div className="w-full flex sm:!flex-col md:!flex-row items-start justify-start pt-10 gap-5 !important">
        <Card className="w-full p-5">
          <VideoPlayer
            serverLink={serverUrl}
            mal={serverLink ? serverLink.malID : null}
            trackSrc={serverLink?.tracks || []}
            thumbnails={serverLink?.tracks?.[1]?.file || ""}
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
          <ScrollArea className="h-[75dvh]">
            {episodeList.length < 50 ? (
              <div className="grid grid-cols-1 gap-3">
                {episodeList.map((ep) => (
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
                    <span className="font-black text-neutral-500">
                      {ep.number}.
                    </span>
                    <span className="w-5/6 truncate text-left">{ep.title}</span>
                  </Button>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-6 gap-3">
                {episodeList.map((ep) => (
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
                    } flex flex-row items-center justify-center`}
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
