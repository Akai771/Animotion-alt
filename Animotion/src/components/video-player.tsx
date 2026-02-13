// video-player.tsx

import React, { useEffect, useState, useRef, useCallback, useMemo } from "react";
import {
  MediaPlayer,
  MediaProvider,
  PlayButton,
  useMediaState,
  useMediaRemote,
  type MediaPlayerInstance,
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
  onNextEpisode?: () => void;
  hasNextEpisode?: boolean;
  nextEpisodeInfo?: {
    title?: string;
    episode?: string;
    duration?: string;
    thumbnail?: string;
  };
  autoFullscreen?: boolean;
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
  const [countdown, setCountdown] = useState(10);
  const [isVisible, setIsVisible] = useState(false);
  const [isExiting, setIsExiting] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const hasNavigated = useRef(false); // Prevent double navigation

  useEffect(() => {
    // Fade in animation
    const fadeInTimer = setTimeout(() => setIsVisible(true), 100);
    
    // Start countdown
    intervalRef.current = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1 && !hasNavigated.current) {
          hasNavigated.current = true;
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

  const handleCancel = useCallback((e?: React.MouseEvent) => {
    e?.stopPropagation();
    setIsExiting(true);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    
    setTimeout(() => {
      onCancel();
    }, 300);
  }, [onCancel]);

  const handlePlayNow = useCallback((e?: React.MouseEvent) => {
    e?.stopPropagation();
    
    if (hasNavigated.current) return; // Prevent double clicks
    
    hasNavigated.current = true;
    
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    
    onNextEpisode();
  }, [onNextEpisode]);

  // Calculate stroke dash offset for timer animation
  const circumference = 2 * Math.PI * 28;
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
      onClick={(e) => e.stopPropagation()} // Prevent event bubbling
    >
      <div className="relative w-80 h-48 rounded-xl overflow-hidden shadow-2xl border border-gray-600/30 group cursor-pointer">
        {/* Background Thumbnail */}
        <div className="absolute inset-0">
          <img
            src={nextEpisodeInfo?.thumbnail || "https://placehold.jp/320x192.png?text=Next+Episode"}
            alt="Next Episode Thumbnail"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
          />
          <div className="absolute inset-0 bg-black/20"></div>
        </div>

        {/* Top Header with Next Up and Cancel */}
        <div className="absolute top-0 left-0 right-0 p-4 flex items-center justify-between z-10">
          <span className="text-sm text-white font-medium tracking-wide drop-shadow-lg">
            Next Up
          </span>
          <button
            onClick={handleCancel}
            className="w-8 h-8 rounded-full bg-black/40 hover:bg-black/60 backdrop-blur-sm flex items-center justify-center transition-all duration-200 hover:scale-110 group/cancel z-30"
            type="button"
          >
            <X size={16} className="text-white/80 group-hover/cancel:text-white transition-colors" />
          </button>
        </div>

        {/* Central Play Button with Timer Ring */}
        <div className="absolute inset-0 flex items-center justify-center">
          <button
            onClick={handlePlayNow}
            className="relative w-16 h-16 rounded-full bg-black/50 hover:bg-black/60 backdrop-blur-sm flex items-center justify-center transition-all duration-300 hover:scale-110 group/play border border-white/20 z-30"
            type="button"
          >
            {/* Timer Circle */}
            <svg 
              className="absolute inset-0 w-full h-full -rotate-90 pointer-events-none" 
              viewBox="0 0 64 64"
            >
              <circle
                cx="32"
                cy="32"
                r="28"
                stroke="rgba(255,255,255,0.2)"
                strokeWidth="2"
                fill="none"
              />
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
            
            <Play 
              size={20} 
              className="text-white ml-1 group-hover/play:scale-110 transition-transform duration-300 drop-shadow-lg pointer-events-none" 
              fill="white" 
            />
            
            <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 pointer-events-none">
              <span className="text-xs font-bold text-white bg-black/50 px-2 py-1 rounded-full backdrop-blur-sm">
                {countdown}s
              </span>
            </div>

            {countdown <= 3 && (
              <div className="absolute inset-0 rounded-full border-2 border-white/60 animate-pulse pointer-events-none"></div>
            )}
          </button>
        </div>

        {/* Bottom Gradient and Episode Info */}
        <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-black/80 via-black/40 to-transparent pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 right-0 p-4 z-10 pointer-events-none">
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
        <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
      </div>
    </div>
  );
};

// Create chapters from intro/outro data
const createChapters = (intro?: { start: number; end: number }, outro?: { start: number; end: number }, duration?: number) => {
  if (!duration || typeof duration !== "number") return "";

  const chapters = [];

  // Pre-intro content (if intro doesn't start at 0)
  if (intro && intro.start > 0) {
    chapters.push(`00:00:00.000 --> ${formatTime(intro.start)}`);
    chapters.push("Opening\n");
  }

  // Intro section
  if (intro) {
    chapters.push(`${formatTime(intro.start)} --> ${formatTime(intro.end)}`);
    chapters.push("Intro\n");
  }

  // Main content section
  const mainStart = intro ? intro.end : 0;
  const mainEnd = outro ? outro.start : duration;
  
  if (mainStart < mainEnd) {
    chapters.push(`${formatTime(mainStart)} --> ${formatTime(mainEnd)}`);
    chapters.push("Episode Content\n");
  }

  // Outro section
  if (outro && outro.start < duration) {
    chapters.push(`${formatTime(outro.start)} --> ${formatTime(duration)}`);
    chapters.push("Credits\n");
  }

  return chapters.join('\n');
};

// Helper function to format time in WebVTT format
const formatTime = (seconds: number): string => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);
  const ms = Math.floor((seconds % 1) * 1000);
  
  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}.${ms.toString().padStart(3, '0')}`;
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
  const [cardWasShown, setCardWasShown] = useState(false);

  // Check if current time is within intro range
  const inIntro = intro &&
    typeof currentTime === "number" &&
    currentTime >= intro.start &&
    currentTime <= intro.end;

  // More robust outro detection
  const shouldShowCard = useCallback(() => {
    if (!hasNextEpisode || !onNextEpisode) return false;
    
    if (typeof currentTime !== "number" || typeof duration !== "number") return false;
    
    // If we have outro data, use it with some buffer
    if (outro) {
      const inOutroRange = currentTime >= outro.start && currentTime <= outro.end;
      if (inOutroRange) return true;
    }
    
    // Fallback: show in last 2 minutes
    const timeRemaining = duration - currentTime;
    return timeRemaining <= 120 && timeRemaining > 5; // 2 minutes before end, but not in last 5 seconds
  }, [currentTime, duration, outro, hasNextEpisode, onNextEpisode]);

  // Main effect to show/hide card
  useEffect(() => {
    const shouldShow = shouldShowCard();
    
    if (shouldShow && !showNextEpisodeCard) {
      setShowNextEpisodeCard(true);
      setCardWasShown(true);
    } else if (!shouldShow && showNextEpisodeCard && cardWasShown) {
      // Only hide if we're far from the outro region to prevent flickering
      if (typeof currentTime === "number" && typeof duration === "number") {
        const timeRemaining = duration - currentTime;
        if (timeRemaining > 150) { // More than 2.5 minutes remaining
          setShowNextEpisodeCard(false);
          setCardWasShown(false);
        }
      }
    }
  }, [shouldShowCard, showNextEpisodeCard, cardWasShown, currentTime, duration]);

  // Check if current time is within outro range (for skip button)
  const inOutro = outro &&
    typeof currentTime === "number" &&
    typeof duration === "number" &&
    currentTime >= outro.start &&
    currentTime <= outro.end;

  const handleSkipIntro = () => {
    if (remote && intro) {
      remote.seek(intro.end + 1);
    }
  };

  const handleSkipOutro = () => {
    if (remote && outro && typeof duration === "number") {
      remote.seek(Math.max(0, duration - 10));
    }
  };

  const handleNextEpisode = useCallback(() => {
    if (onNextEpisode) {
      onNextEpisode();
    }
  }, [onNextEpisode]);

  const handleCancelNextEpisode = useCallback(() => {
    setShowNextEpisodeCard(false);
    // Don't reset cardWasShown so it can show again if still in outro
  }, []);

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
  autoFullscreen = false,
}) => {
  const [key, setKey] = useState<number>(Date.now());
  const [loading, setLoading] = useState<boolean>(false);
  const [isFirstLoad, setIsFirstLoad] = useState<boolean>(true);
  const playerRef = useRef<MediaPlayerInstance>(null);

  useEffect(() => {
    import("@vidstack/react/player/styles/default/theme.css");
    import("@vidstack/react/player/styles/default/layouts/video.css");
  }, []);

  // Generate chapters immediately when intro/outro data is available
  const chaptersVTT = useMemo(() => {
    if (!intro && !outro) return null;
    
    // Create a reasonable default duration if we have intro/outro data
    // We'll use the outro end time as a fallback, or intro end + 20 minutes
    const estimatedDuration = outro?.end || (intro ? intro.end + 1200 : 1500);
    const chaptersText = createChapters(intro, outro, estimatedDuration);
    
    if (chaptersText) {
      return `data:text/vtt;charset=utf-8,${encodeURIComponent(`WEBVTT\n\n${chaptersText}`)}`;
    }
    return null;
  }, [intro, outro]);

  // Auto-refresh player when serverLink or trackSrc changes (episode switching)
  useEffect(() => {
    // Skip fullscreen for the initial load
    if (isFirstLoad) {
      setIsFirstLoad(false);
      setKey(Date.now());
      return;
    }

    // Only trigger fullscreen for episode changes, not initial load
    if (serverLink) {
      setKey(Date.now());
      
      // Only enter fullscreen if autoFullscreen is enabled
      if (autoFullscreen) {
        // Delay fullscreen request to allow player to initialize
        const fullscreenTimeout = setTimeout(() => {
          if (playerRef.current) {
            // Use the MediaPlayer's remoteControl to enter fullscreen
            try {
              const remote = playerRef.current.remoteControl;
              if (remote) {
                remote.enterFullscreen();
              }
            } catch (error) {
              console.log('Fullscreen request failed:', error);
            }
          }
        }, 1000); // Wait 1 second for player to fully initialize

        return () => clearTimeout(fullscreenTimeout);
      }
    }
  }, [serverLink, trackSrc, isFirstLoad, autoFullscreen]);

  // Handle refresh function
  const handleRefresh = useCallback(() => {
    setLoading(true);
    setKey(Date.now());

    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }, []);

  // Keyboard event handler for refresh
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      // Use Ctrl+Shift+R for video player refresh (won't conflict with browser refresh)
      if (event.ctrlKey && event.shiftKey && event.key.toLowerCase() === 'r') {
        event.preventDefault(); // Prevent any default behavior
        handleRefresh();
      }
    };

    // Add event listener
    document.addEventListener('keydown', handleKeyPress);

    // Cleanup event listener
    return () => {
      document.removeEventListener('keydown', handleKeyPress);
    };
  }, [handleRefresh]);



  // Filter and get English track
  const trackSource = trackSrc.filter((track) => track.lang === "English");
  const track = trackSource.length > 0 ? trackSource[0].url : "";

  // Placeholder image
  const placeholderImage = "https://placehold.jp/000000/ffffff/1920x1080.png?text=Loading...&css=%7B%22font-weight%22%3A%22%20700%22%7D";

  return (
    <div className="relative">
      <div className="absolute top-2 right-2 z-10">
        <Button
          variant="outline"
          size="sm"
          className="bg-black/60 hover:bg-black/80 text-white border-white/20"
          onClick={handleRefresh}
          disabled={loading}
          title="Refresh Player (Ctrl+Shift+R)"
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
          ref={playerRef}
          key={key}
          className="VideoPlayer"
          src={{
            src: serverLink,
            type: 'application/x-mpegurl',
          }}
          // autoplay
          crossOrigin="anonymous"
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
            {chaptersVTT && (
              <track
                kind="chapters"
                src={chaptersVTT}
                default
              />
            )}
          </MediaProvider>
          <DefaultVideoLayout
            icons={defaultLayoutIcons}
            thumbnails={thumbnails}
          />
          
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