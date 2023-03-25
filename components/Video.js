import { useRef, useState } from "react";
import ReactPlayer from "react-player";
import { AnimatePresence, motion as m } from "framer-motion";
import { useRouter } from "next/router";
import { useTranslation } from "next-i18next";

export default function CustomVideoPlayer({ videoUrl, setCanPlay, canPlay }) {
  const { t } = useTranslation("common");
  const { locale } = useRouter();
  const [isPlaying, setIsPlaying] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const [playedSeconds, setPlayedSeconds] = useState(0);
  const playerRef = useRef(null);
  const progressBarRef = useRef(null);
  const [duration, setDuration] = useState(0);

  function formatTime(time) {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);

    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  }

  const handleProgress = state => {
    setPlayedSeconds(state.playedSeconds);
  };

  let currentWidthOfProgressBar = 100 * (playedSeconds / duration); // calculate the percentage of the video that has been played
  currentWidthOfProgressBar = Math.max(1, currentWidthOfProgressBar); // make sure it's at least 1%
  currentWidthOfProgressBar = Math.round(currentWidthOfProgressBar * 100) / 100; // round to 2 decimal places

  return (
    <div
      className={`relative overflow-hidden ${
        !canPlay || !videoUrl ? "h-80" : ""
      }`}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      {(!canPlay || !videoUrl) && (
        <div className="absolute inset-0 z-30 bg-second-color">
          <div className={`animate-skeleton absolute inset-0`}></div>
        </div>
      )}
      <div
        className="absolute inset-0 z-10 cursor-pointer"
        onClick={() => setIsPlaying(prev => !prev)}
      ></div>
      <AnimatePresence>
        {(isHovering || !isPlaying) && (
          <m.div
            initial={{ opacity: 0, scaleY: 0, y: 100 }}
            animate={{
              opacity: 1,
              scaleY: 1,
              y: 0,
              transition: { duration: 0.2, ease: "easeOut" },
            }}
            exit={{
              opacity: 0,
              transition: { duration: 1, ease: "easeIn", delay: 1 },
            }}
            className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-option-text-color/70 via-option-text-color/50 to-main-color/0 z-20 p-4 pt-3"
          >
            {/* play/pause button, volume, times (numbers and scrollbar), full screen, pip  */}

            <div>
              {/* container for all the top part */}
              <div className="flex gap-4">
                {/* container for the left part */}
                {/* play icon: */}
                <button
                  onClick={() => setIsPlaying(prev => !prev)}
                  className="backdrop-blur-xl p-2 rounded-lg"
                  title={isPlaying ? t("pause") : t("play")}
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
            <div
              ref={progressBarRef}
              onClick={e => {
                // get position of the click in the progress bar
                const rect = progressBarRef.current.getBoundingClientRect();
                const x =
                  locale === "en"
                    ? e.clientX - rect.left
                    : rect.right - e.clientX;
                // calculate the percentage of the click
                const percentage = x / rect.width;
                // calculate the time of the video
                const time = Math.floor(percentage * duration); // Math.floor() is needed because seekTo() doesn't accept decimals (weird behavior when passing 0.someNumber)
                // set the time of the video
                setPlayedSeconds(time); // much faster than waiting for seekTo() to finish
                // jump to the time
                playerRef.current.seekTo(time);
              }}
              className="cursor-pointer group w-full backdrop-blur-xl rounded-lg h-2 mt-2 bg-main-color/20 relative hover:scale-y-150 transition-all"
            >
              <m.div
                layout
                style={{
                  width: currentWidthOfProgressBar + "%",
                }}
                className={`absolute inset-0 bg-gradient-to-tl from-main-color to-third-color rounded-lg`}
              >
                {/* thumb indicator (round little thing in the progress bar) */}
                <div
                  className={`rounded-full h-4 w-4 bg-third-color absolute ${
                    locale === "en"
                      ? "right-0 translate-x-1/2"
                      : "left-0 -translate-x-1/2"
                  } top-1/2 -translate-y-1/2 scale-0 group-hover:scale-x-100 group-hover:scale-y-75 transition-transform`}
                ></div>
              </m.div>
            </div>
          </m.div>
        )}
      </AnimatePresence>
      {videoUrl && (
        <ReactPlayer
          ref={playerRef}
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
      )}
    </div>
  );
}
