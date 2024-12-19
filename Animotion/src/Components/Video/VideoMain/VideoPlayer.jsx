import React, { useEffect } from "react";
import { MediaPlayer, MediaProvider, PlayButton, useMediaStore } from '@vidstack/react';
import { defaultLayoutIcons, DefaultVideoLayout } from '@vidstack/react/player/layouts/default';
import './VideoPlayer.css';

function VideoPlayer({ serverLink, trackSrc, mal, thumbnails }) {
    useEffect(() => {
        import('@vidstack/react/player/styles/default/theme.css');
        import('@vidstack/react/player/styles/default/layouts/video.css');
    }, []);

    const trackSource = trackSrc
        ? trackSrc.filter((track) => track.label === "English")
        : [];

    const track = trackSource.map((track) => track.file);

    const volume = useMediaStore((store) => store.volume);

    useEffect(() => {
        if (volume !== 50) {
            setTimeout(() => {
                const mediaElement = document.querySelector('media-player');
                if (mediaElement) {
                    mediaElement.volume = 0.5;
                }
            }, 0);
        }
    }, [volume]);

    // Placeholder image
    const placeholderImage = "https://via.placeholder.com/1920x1080?text=Loading...";

    return (
        <div className="VideoPlayerContainer">
            {serverLink ? (
                <MediaPlayer
                    key={mal}
                    className="VideoPlayer"
                    src={serverLink}
                    autoplay
                    crossorigin
                    playsinline
                    volume={0.5}
                >
                    <MediaProvider>
                        <PlayButton />
                        <track
                            kind="captions"
                            srcLang="en"
                            src={track.toString()}
                            label="English"
                            default
                        />
                    </MediaProvider>
                    <DefaultVideoLayout icons={defaultLayoutIcons} thumbnails={thumbnails} />
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
}

export default VideoPlayer;