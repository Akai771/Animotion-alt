import React, { useEffect, useState } from "react";
import { MediaPlayer, MediaProvider, PlayButton } from "@vidstack/react";
import { defaultLayoutIcons, DefaultVideoLayout } from "@vidstack/react/player/layouts/default";
import { RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
// import "./VideoPlayer.css";

// Define Props Interface
interface VideoPlayerProps {
  serverLink: string | null;
  originalLink?: string;
  trackSrc?: { label: any; file: any }[];
  mal?: string;
  thumbnails?: string;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({ serverLink, trackSrc = [], thumbnails }) => {
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
    
    // Small timeout to simulate refresh and show loading state
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
    <div className="VideoPlayerContainer relative">
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
        </MediaPlayer>
      ) : (
        <img src={placeholderImage} alt="Placeholder" className="PlaceholderImage" />
      )}
    </div>
  );
};

export default VideoPlayer;