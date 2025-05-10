// video-player.tsx
// This file is part of the Animotion Website.

import React, { useEffect, useState } from "react";
import { MediaPlayer, MediaProvider, PlayButton, useMediaState, useMediaRemote } from "@vidstack/react";
import { defaultLayoutIcons, DefaultVideoLayout } from "@vidstack/react/player/layouts/default";
import { RefreshCw, SkipForward } from "lucide-react";
import { Button } from "@/components/ui/button";

// Define Props Interface
interface VideoPlayerProps {
  serverLink: string | null;
  trackSrc?: { label: any; file: any }[];
  mal?: string;
  thumbnails?: string;
  intro?: { start: number; end: number };
  outro?: { start: number; end: number };
}

// Custom Skip Intro/Outro Button Component
const SkipControls: React.FC<{
  intro?: { start: number; end: number };
  outro?: { start: number; end: number };
}> = ({ intro, outro }) => {
  const currentTime = useMediaState('currentTime');
  const duration = useMediaState('duration');
  const remote = useMediaRemote();
  
  // Check if current time is within intro range
  const inIntro = intro && 
    typeof currentTime === 'number' && 
    currentTime >= intro.start && 
    currentTime <= intro.end;
  
  // Check if current time is within outro range
  const inOutro = outro && 
    typeof currentTime === 'number' && 
    typeof duration === 'number' &&
    currentTime >= outro.start && 
    currentTime <= outro.end;

  const handleSkipIntro = () => {
    if (remote && intro) {
      remote.seek(intro.end + 1); // Skip just after intro ends
    }
  };

  const handleSkipOutro = () => {
    if (remote && outro && typeof duration === 'number') {
      // Skip to 10 seconds before the end
      remote.seek(Math.max(0, duration - 10));
    }
  };

  if (!inIntro && !inOutro) return null;

  return (
    <div className="absolute bottom-[80px] right-4 z-10">
      {inIntro && (
        <Button 
          variant="secondary" 
          size="sm"
          className="mr-2 bg-purple-600 hover:bg-purple-800 text-white border-none"
          onClick={handleSkipIntro}
        >
          <SkipForward size={16} className="mr-1" />
          Skip Intro
        </Button>
      )}
      {inOutro && (
        <Button 
          variant="secondary" 
          size="sm"
          className="bg-purple-600 hover:bg-purple-700 text-white border-none"
          onClick={handleSkipOutro}
        ><SkipForward size={16} className="mr-1" />Skip Outro
        </Button>
      )}
    </div>
  );
};

const VideoPlayer: React.FC<VideoPlayerProps> = ({ 
  serverLink, 
  trackSrc = [], 
  thumbnails,
  intro, // From API
  outro  // From API
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
  const trackSource = trackSrc.filter((track) => track.label === "English");
  const track = trackSource.length > 0 ? trackSource[0].file : "";

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
        >
          <RefreshCw size={16} className={`mr-1 ${loading ? 'animate-spin' : ''}`} />
          {loading ? 'Refreshing...' : 'Refresh Player'}
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
              <track kind="captions" srcLang="en" src={track} label="English" default />
            )}
          </MediaProvider>
          <DefaultVideoLayout icons={defaultLayoutIcons} thumbnails={thumbnails} />
          
          {/* Add Custom Skip Controls */}
          <SkipControls 
            intro={intro} 
            outro={outro} 
          />
        </MediaPlayer>
      ) : (
        <img src={placeholderImage} alt="Placeholder" className="PlaceholderImage" />
      )}
    </div>
  );
};

export default VideoPlayer;