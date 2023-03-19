import { useRef, useState } from "react";
import ReactPlayer from "react-player";
import LikeIcon from "./icons/LikeIcon";
import { motion } from "framer-motion";
import { useRouter } from "next/router";

export default function CustomVideoPlayer({ videoUrl, setCanPlay }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const [playedSeconds, setPlayedSeconds] = useState(0);
  const [duration, setDuration] = useState(0);
  function formatTime(time) {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);

    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  }

  const handleProgress = state => {
    setPlayedSeconds(state.playedSeconds);
  };

  return (
    <div
      className="relative overflow-hidden"
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      <div
        className="absolute inset-0 z-10 cursor-pointer"
        onClick={() => setIsPlaying(prev => !prev)}
      ></div>
      {(isHovering || !isPlaying) && (
        <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-option-text-color/70 via-option-text-color/50 to-main-color/0 z-20 p-4 pt-3">
          {/* play/pause button, volume, times (numbers and scrollbar), full screen, pip  */}

          <div>
            {/* container for all the top part */}
            <div className="flex gap-4">
              {/* container for the left part */}
              {/* play icon: */}
              <button
                onClick={() => setIsPlaying(prev => !prev)}
                className="backdrop-blur-xl p-2 rounded-lg"
              >
                {isPlaying ? (
                  <svg className="w-6 h-6">
                    <path d="M0 0h24v24H0z" fill="none" />
                    <path
                      d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"
                      className="fill-second-color"
                    />
                  </svg>
                ) : (
                  <svg className="w-6 h-6">
                    <path d="M0 0h24v24H0z" fill="none" />
                    <path d="M8 5v14l11-7z" className="fill-second-color" />
                  </svg>
                )}
              </button>
              {/* time */}
              <div className="flex items-center gap-2 backdrop-blur-xl p-2 rounded-lg">
                <span className="text-second-color text-opacity-70">
                  {formatTime(playedSeconds)}
                </span>
                <span className="text-second-color text-opacity-70">/</span>
                <span className="text-second-color text-opacity-100">
                  {formatTime(duration)}
                </span>
              </div>
            </div>
          </div>
          {/* container for the bottom part */}
          <div className="w-full backdrop-blur-xl rounded-lg overflow-hidden h-2 mt-2 bg-main-color/20 relative hover:scale-y-150 transition-all">
            <div
              style={{
                width:
                  playedSeconds === 0
                    ? 0
                    : Math.floor(100 * (playedSeconds / duration)) + "%",
              }}
              className={`absolute inset-0 bg-third-color`}
            ></div>
          </div>
        </div>
      )}
      <ReactPlayer
        onEnded={() => setIsPlaying(false)}
        onProgress={handleProgress}
        playing={isPlaying}
        width="unset"
        height="unset"
        onDuration={d => setDuration(d)}
        className={`[&_video]:block [&_video]:max-h-[70vh]`}
        onCanPlay={() => {
          setCanPlay(true);
        }}
        url={videoUrl}
      />
    </div>
  );
}
