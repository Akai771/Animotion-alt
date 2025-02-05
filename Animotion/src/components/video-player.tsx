import React, { useEffect } from "react";
import { MediaPlayer, MediaProvider, PlayButton, useMediaStore } from "@vidstack/react";
import { defaultLayoutIcons, DefaultVideoLayout } from "@vidstack/react/player/layouts/default";
// import "./VideoPlayer.css";

// Define Props Interface
interface VideoPlayerProps {
  serverLink: string | null;
  trackSrc?: { label: any; file: any }[];
  mal?: string;
  thumbnails?: string;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({ serverLink, trackSrc =[], mal, thumbnails }) => {
  useEffect(() => {
    import("@vidstack/react/player/styles/default/theme.css");
    import("@vidstack/react/player/styles/default/layouts/video.css");
    
    console.log(trackSrc);
}, []);



  // Filter and get English track
  const trackSource = trackSrc.filter((track) => track.label === "English");
  const track = trackSource.length > 0 ? trackSource[0].file : "";

//   const volume = useMediaStore((store) => store.volume);

//   useEffect(() => {
//     if (volume !== 50) {
//       setTimeout(() => {
//         const mediaElement = document.querySelector("media-player") as HTMLMediaElement | null;
//         if (mediaElement) {
//           mediaElement.volume = 0.5;
//         }
//       }, 0);
//     }
//   }, [volume]);

  // Placeholder image
  const placeholderImage = "https://placehold.jp/000000/ffffff/1920x1080.png?text=Loading...&css=%7B%22font-weight%22%3A%22%20700%22%7D";

  return (
    <div className="VideoPlayerContainer">
      {serverLink ? (
        <MediaPlayer
          key={mal}
          className="VideoPlayer"
          src={serverLink}
          autoplay
          crossorigin="anonymous"
          playsInline
        //   volume={0.5}
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
