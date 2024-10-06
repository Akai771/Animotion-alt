import React, {useEffect} from "react";
import { MediaPlayer, MediaProvider, PlayButton, useMediaStore} from '@vidstack/react';
import { defaultLayoutIcons, DefaultVideoLayout } from '@vidstack/react/player/layouts/default';
import './VideoPlayer.css';

function VideoPlayer({serverLink, trackSrc, mal}) {
    useEffect(() => {
        import ('@vidstack/react/player/styles/default/theme.css');
        import ('@vidstack/react/player/styles/default/layouts/video.css');
    }, []);
    const trackSource = trackSrc?trackSrc.filter((track) => {
        return track.label === "English";
    }):[];

    const track = trackSource.map((track) => {
        return track.file;
    });
    // console.log(serverLink);

    const volume = useMediaStore((store) => store.volume);
    useEffect(() => {
        // Ensure volume is set to 50% after component mounts
        if (volume !== 50) {
            setTimeout(() => {
                const mediaElement = document.querySelector('media-player');
                if (mediaElement) {
                    mediaElement.volume = 0.5;
                }
            }, 0);
        }
    }, [volume]);

    return (
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
            <DefaultVideoLayout icons={defaultLayoutIcons}/>
        </MediaPlayer>
    )
}

export default VideoPlayer;