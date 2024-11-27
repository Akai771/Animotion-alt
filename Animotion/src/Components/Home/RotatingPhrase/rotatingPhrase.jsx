import React, { useState, useEffect } from "react";
import "./RotatingPhrase.css";

const RotatingPhrase = () => {
  return (
    <a href="animotion.apk" download>
        <div className="phrase-container">
            <h1 className="rotating-text">Discover the ultimate streaming experience with <span>Animotion</span>! Click here to download our APK and explore a world of your favorite anime anytime, anywhere. Try it now and enjoy seamless access on your mobile device.</h1>
        </div>
    </a>
  );
};

export default RotatingPhrase;
