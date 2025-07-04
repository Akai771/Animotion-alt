// video-player.tsx
// This file is part of the Animotion Website.

import React, { useEffect, useState, useRef } from "react";
import {
  MediaPlayer,
  MediaProvider,
  PlayButton,
  useMediaState,
  useMediaRemote,
} from "@vidstack/react";
import {
  defaultLayoutIcons,
  DefaultVideoLayout,
} from "@vidstack/react/player/layouts/default";
import { RefreshCw, SkipForward, X, Play } from "lucide-react";
import { Button } from "@/components/ui/button";

// Define Props Interface
interface VideoPlayerProps {
  serverLink: string | null;
  trackSrc?: {
    url: any;
    lang: string;
    label: any;
    file: any;
  }[];
  mal?: string;
  thumbnails?: string;
  intro?: { start: number; end: number };
  outro?: { start: number; end: number };
  onNextEpisode?: () => void; // New prop for next episode navigation
  hasNextEpisode?: boolean; // New prop to check if next episode exists
  nextEpisodeInfo?: {
    title?: string;
    episode?: string;
    duration?: string;
    thumbnail?: string;
  };
}

// Next Episode Countdown Card Component
const NextEpisodeCard: React.FC<{
  onNextEpisode: () => void;
  nextEpisodeInfo?: {
    title?: string;
    episode?: string;
    duration?: string;
    thumbnail?: string;
  };
  onCancel: () => void;
}> = ({ onNextEpisode, nextEpisodeInfo, onCancel }) => {
  const [countdown, setCountdown] = useState(10); // 10 seconds countdown
  const [isVisible, setIsVisible] = useState(false);
  const [isExiting, setIsExiting] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Fade in animation
    const fadeInTimer = setTimeout(() => setIsVisible(true), 100);
    
    // Start countdown
    intervalRef.current = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          // Auto advance to next episode when countdown reaches 0
          onNextEpisode();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      clearTimeout(fadeInTimer);
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [onNextEpisode]);

  const handleCancel = () => {
    setIsExiting(true);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    
    // Exit animation then remove component
    setTimeout(() => {
      onCancel();
    }, 300);
  };

  const handlePlayNow = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    onNextEpisode();
  };

  // Calculate stroke dash offset for timer animation
  const circumference = 2 * Math.PI * 28; // radius = 28
  const strokeDashoffset = circumference - (countdown / 10) * circumference;

  return (
    <div 
      className={`absolute bottom-[100px] right-6 z-20 transition-all duration-500 ease-out ${
        isVisible && !isExiting 
          ? 'opacity-100 translate-y-0' 
          : isExiting 
          ? 'opacity-0 translate-y-4 scale-95'
          : 'opacity-0 translate-y-8'
      }`}
    >
      <div className="relative w-80 h-48 rounded-xl overflow-hidden shadow-2xl border border-gray-600/30 group cursor-pointer">
        {/* Background Thumbnail */}
        <div className="absolute inset-0">
          <img
            src={nextEpisodeInfo?.thumbnail || "https://placehold.jp/320x192.png?text=Next+Episode"}
            alt="Next Episode Thumbnail"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
          />
          {/* Dark overlay for better contrast */}
          <div className="absolute inset-0 bg-black/20"></div>
        </div>

        {/* Top Header with Next Up and Cancel */}
        <div className="absolute top-0 left-0 right-0 p-4 flex items-center justify-between z-10">
          <span className="text-sm text-white font-medium tracking-wide drop-shadow-lg">
            Next Up
          </span>
          <button
            onClick={handleCancel}
            className="w-8 h-8 rounded-full bg-black/40 hover:bg-black/60 backdrop-blur-sm flex items-center justify-center transition-all duration-200 hover:scale-110 group/cancel"
          >
            <X size={16} className="text-white/80 group-hover/cancel:text-white transition-colors" />
          </button>
        </div>

        {/* Central Play Button with Timer Ring */}
        <div className="absolute inset-0 flex items-center justify-center">
          <button
            onClick={handlePlayNow}
            className="relative w-16 h-16 rounded-full bg-black/50 hover:bg-black/60 backdrop-blur-sm flex items-center justify-center transition-all duration-300 hover:scale-110 group/play border border-white/20"
          >
            {/* Timer Circle */}
            <svg 
              className="absolute inset-0 w-full h-full -rotate-90" 
              viewBox="0 0 64 64"
            >
              {/* Background circle */}
              <circle
                cx="32"
                cy="32"
                r="28"
                stroke="rgba(255,255,255,0.2)"
                strokeWidth="2"
                fill="none"
              />
              {/* Progress circle */}
              <circle
                cx="32"
                cy="32"
                r="28"
                stroke="#ffffff"
                strokeWidth="3"
                fill="none"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                className="transition-all duration-1000 ease-linear"
                strokeLinecap="round"
              />
            </svg>
            
            {/* Play Icon */}
            <Play 
              size={20} 
              className="text-white ml-1 group-hover/play:scale-110 transition-transform duration-300 drop-shadow-lg" 
              fill="white" 
            />
            
            {/* Countdown number */}
            <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2">
              <span className="text-xs font-bold text-white bg-black/50 px-2 py-1 rounded-full backdrop-blur-sm">
                {countdown}s
              </span>
            </div>

            {/* Pulse animation for urgency when countdown is low */}
            {countdown <= 3 && (
              <div className="absolute inset-0 rounded-full border-2 border-white/60 animate-pulse"></div>
            )}
          </button>
        </div>

        {/* Bottom Gradient and Episode Info */}
        <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
        <div className="absolute bottom-0 left-0 right-0 p-4 z-10">
          <div className="flex items-end justify-between">
            <div>
              <h3 className="text-lg font-semibold text-white mb-1 drop-shadow-lg">
                {nextEpisodeInfo?.episode || "Episode 1"}
              </h3>
              <p className="text-sm text-white/80 drop-shadow-md line-clamp-1">
                {nextEpisodeInfo?.title || "Continue watching"}
              </p>
            </div>
            <span className="text-xs text-white/70 bg-black/30 px-2 py-1 rounded backdrop-blur-sm">
              {nextEpisodeInfo?.duration || "25m"}
            </span>
          </div>
        </div>

        {/* Hover overlay */}
        <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      </div>
    </div>
  );
};

// Custom Skip Intro/Outro Button Component
const SkipControls: React.FC<{
  intro?: { start: number; end: number };
  outro?: { start: number; end: number };
  onNextEpisode?: () => void;
  hasNextEpisode?: boolean;
  nextEpisodeInfo?: {
    title?: string;
    episode?: string;
    duration?: string;
    thumbnail?: string;
  };
}> = ({ intro, outro, onNextEpisode, hasNextEpisode, nextEpisodeInfo }) => {
  const currentTime = useMediaState("currentTime");
  const duration = useMediaState("duration");
  const remote = useMediaRemote();
  const [showNextEpisodeCard, setShowNextEpisodeCard] = useState(false);

  // Check if current time is within intro range
  const inIntro =
    intro &&
    typeof currentTime === "number" &&
    currentTime >= intro.start &&
    currentTime <= intro.end;

  // Check if current time is within outro range
  const inOutro =
    outro &&
    typeof currentTime === "number" &&
    typeof duration === "number" &&
    currentTime >= outro.start &&
    currentTime <= outro.end;

  // Show next episode card when in outro
  useEffect(() => {
    if (inOutro && hasNextEpisode && onNextEpisode && !showNextEpisodeCard) {
      setShowNextEpisodeCard(true);
    } else if (!inOutro && showNextEpisodeCard) {
      setShowNextEpisodeCard(false);
    }
  }, [inOutro, hasNextEpisode, onNextEpisode, showNextEpisodeCard]);

  const handleSkipIntro = () => {
    if (remote && intro) {
      remote.seek(intro.end + 1); // Skip just after intro ends
    }
  };

  const handleSkipOutro = () => {
    if (remote && outro && typeof duration === "number") {
      // Skip to 10 seconds before the end
      remote.seek(Math.max(0, duration - 10));
    }
  };

  const handleNextEpisode = () => {
    if (onNextEpisode) {
      onNextEpisode();
    }
  };

  const handleCancelNextEpisode = () => {
    setShowNextEpisodeCard(false);
  };

  return (
    <>
      {/* Regular Skip Buttons */}
      {(inIntro || (inOutro && !showNextEpisodeCard)) && (
        <div className="absolute bottom-[80px] right-4 z-10 flex gap-2">
          {inIntro && (
            <Button
              variant="secondary"
              size="sm"
              className="bg-purple-600 hover:bg-purple-800 text-white border-none"
              onClick={handleSkipIntro}
            >
              <SkipForward size={16} className="mr-1" />
              Skip Intro
            </Button>
          )}

          {inOutro && !showNextEpisodeCard && (
            <Button
              variant="secondary"
              size="sm"
              className="bg-purple-600 hover:bg-purple-700 text-white border-none"
              onClick={handleSkipOutro}
            >
              <SkipForward size={16} className="mr-1" />
              Skip Outro
            </Button>
          )}
        </div>
      )}

      {/* Next Episode Countdown Card */}
      {showNextEpisodeCard && onNextEpisode && (
        <NextEpisodeCard
          onNextEpisode={handleNextEpisode}
          nextEpisodeInfo={nextEpisodeInfo}
          onCancel={handleCancelNextEpisode}
        />
      )}
    </>
  );
};

const VideoPlayer: React.FC<VideoPlayerProps> = ({
  serverLink,
  trackSrc = [],
  thumbnails,
  intro,
  outro,
  onNextEpisode,
  hasNextEpisode,
  nextEpisodeInfo,
}) => {
  const [key, setKey] = useState<number>(Date.now());
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    import("@vidstack/react/player/styles/default/theme.css");
    import("@vidstack/react/player/styles/default/layouts/video.css");
  }, []);

  // Handle refresh button click
  const handleRefresh = () => {
    setLoading(true);
    setKey(Date.now());

    setTimeout(() => {
      setLoading(false);
    }, 1000);
  };

  // Filter and get English track
  const trackSource = trackSrc.filter((track) => track.lang === "English");
  const track = trackSource.length > 0 ? trackSource[0].url : "";

  // Placeholder image
  const placeholderImage =
    "https://placehold.jp/000000/ffffff/1920x1080.png?text=Loading...&css=%7B%22font-weight%22%3A%22%20700%22%7D";

  return (
    <div className="relative">
      <div className="absolute top-2 right-2 z-10">
        <Button
          variant="outline"
          size="sm"
          className="bg-black/60 hover:bg-black/80 text-white border-white/20"
          onClick={handleRefresh}
          disabled={loading}
        >
          <RefreshCw
            size={16}
            className={`mr-1 ${loading ? "animate-spin" : ""}`}
          />
          {loading ? "Refreshing..." : "Refresh Player"}
        </Button>
      </div>

      {serverLink ? (
        <MediaPlayer
          key={key}
          className="VideoPlayer"
          src={serverLink}
          autoplay
          crossorigin="anonymous"
          playsInline
          volume={0.5}
        >
          <MediaProvider>
            <PlayButton />
            {track && (
              <track
                kind="captions"
                srcLang="en"
                src={track}
                label="English"
                default
              />
            )}
          </MediaProvider>
          <DefaultVideoLayout
            icons={defaultLayoutIcons}
            thumbnails={thumbnails}
          />

          {/* Add Custom Skip Controls with Next Episode Card */}
          <SkipControls
            intro={intro}
            outro={outro}
            onNextEpisode={onNextEpisode}
            hasNextEpisode={hasNextEpisode}
            nextEpisodeInfo={nextEpisodeInfo}
          />
        </MediaPlayer>
      ) : (
        <img
          src={placeholderImage}
          alt="Placeholder"
          className="PlaceholderImage"
        />
      )}
    </div>
  );
};

export default VideoPlayer;