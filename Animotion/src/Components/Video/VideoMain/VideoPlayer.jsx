import React from "react";
import '@vidstack/react/player/styles/default/theme.css';
import '@vidstack/react/player/styles/default/layouts/video.css';
import { MediaPlayer, MediaProvider, PlayButton} from '@vidstack/react';
import { defaultLayoutIcons, DefaultVideoLayout } from '@vidstack/react/player/layouts/default';
import './VideoPlayer.css';

function VideoPlayer({serverLink, kind, trackSrc, label, mal }) {
    const trackSource = trackSrc?trackSrc.filter((track) => {
        return track.label === "English";
    }):[];

    const track = trackSource.map((track) => {
        return track.file;
    });
    return (
        <MediaPlayer 
            key={mal} 
            className="VideoPlayer" 
            title="Sprite Fight" 
            src={serverLink} 
            autoplay
            crossorigin
            playsinline
        >
            <MediaProvider>
                <PlayButton />
                <track
                    kind="captions"
                    srcLang="en" 
                    src={track.toString()}
                    label="English"
                 />
            </MediaProvider>
            <DefaultVideoLayout icons={defaultLayoutIcons} />
        </MediaPlayer>
    )
}

export default VideoPlayer;