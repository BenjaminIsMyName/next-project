import { useContext, useEffect, useRef, useState } from "react";
// import ReactPlayer from "react-player"; // not used anymore
import { AnimatePresence, motion as m } from "framer-motion";
import { useRouter } from "next/router";
import { useTranslation } from "next-i18next";
import useLoaded from "../hooks/useLoaded";
import { useIdleTimer } from "react-idle-timer";
import { motion } from "framer-motion";
import { AlertContext } from "@context/AlertContext";

/*

  This component is used to play videos in posts.
  It's a custom video player.
  I used ReactPlayer before, but it didn't contribute much to the project, so I decided to build it completely from scratch.

  */

export default function CustomVideoPlayer({ videoUrl, setCanPlay, canPlay }) {
  const loaded = useLoaded();
  const { t } = useTranslation("common");
  const { locale } = useRouter();
  const [isPlaying, setIsPlaying] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const [playedSeconds, setPlayedSeconds] = useState(0);
  const { add } = useContext(AlertContext);
  const playerRef = useRef();
  const [duration, setDuration] = useState(0);
  const containerRef = useRef(); // to show the entire custom video player in full screen (see: https://stackoverflow.com/a/52879736)
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [isPip, setIsPip] = useState(false);
  const [focusOnProgressBar, setFocusOnProgressBar] = useState(false);
  const [isDraggingProgressBar, setIsDraggingProgressBar] = useState(false);
  const isStillClickedRef = useRef(false);

  function formatTime(time) {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);

    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  }

  // for ReactPlayer (not used anymore)
  // const handleProgress = state => {
  //   setPlayedSeconds(state.playedSeconds);
  // };

  const handleTimeUpdate = e => {
    setPlayedSeconds(e.target.currentTime);
  };

  let currentWidthOfProgressBar = 100 * (playedSeconds / duration); // calculate the percentage of the video that has been played
  currentWidthOfProgressBar = Math.max(1, currentWidthOfProgressBar); // make sure it's at least 1%
  currentWidthOfProgressBar = Math.round(currentWidthOfProgressBar * 100) / 100; // round to 2 decimal places

  useEffect(() => {
    if (playerRef.current) {
      if (isPlaying) {
        playerRef.current.play();
      } else {
        playerRef.current.pause();
      }
    }
  }, [isPlaying]);

  useEffect(() => {
    if (playerRef.current) {
      setDuration(playerRef.current.duration);
    }
  }, [canPlay]);

  useEffect(() => {
    function handleEvent() {
      setIsFullScreen(document.fullscreenElement ? true : false);
    }
    // if leaving full screen by pressing ESC, we need to update the state
    document.addEventListener("fullscreenchange", handleEvent);

    return () => {
      document.removeEventListener("fullscreenchange", handleEvent);
    };
  }, []);

  useEffect(() => {
    function handleEvent() {
      setIsPip(document.pictureInPictureElement ? true : false);
    }

    document.addEventListener("enterpictureinpicture", handleEvent);
    document.addEventListener("leavepictureinpicture", handleEvent);

    return () => {
      document.removeEventListener("enterpictureinpicture", handleEvent);
      document.removeEventListener("leavepictureinpicture", handleEvent);
    };
  }, []);

  const [isIdle, setIsIdle] = useState(false); // if the user is idle *while hovering on a video that is being played*, we want to hide the cursor and controls
  const [shouldHideCursor, setShouldHideCursor] = useState(false); // a few seconds *after* idle
  const setTimeoutRef = useRef();

  useEffect(() => {
    if (isIdle) {
      setTimeoutRef.current = setTimeout(() => {
        setShouldHideCursor(true);
      }, 1500);
    } else {
      setShouldHideCursor(false); // not idle anymore, so show the cursor and controls
    }
    return () => {
      if (setTimeoutRef.current) clearTimeout(setTimeoutRef.current);
    };
  }, [isIdle]);

  const timer = useIdleTimer({
    element: containerRef.current,
    onIdle: () => setIsIdle(true),
    onActive: () => setIsIdle(false),
    startManually: true,
    startOnMount: false,
    timeout: 3000,
  });

  const timerRef = useRef();
  timerRef.current = timer;
  useEffect(() => {
    if (isPlaying && isHovering) {
      timerRef.current.start();
    } else {
      timerRef.current.pause();
      setIsIdle(false);
    }
  }, [isPlaying, isHovering]);

  function togglePlay() {
    if (document.pictureInPictureElement) {
      document.exitPictureInPicture();
    }
    setIsPlaying(prev => !prev);
  }

  return (
    <div
      ref={containerRef}
      className={`relative overflow-hidden ${
        !canPlay || !videoUrl ? "h-80" : ""
      } ${isFullScreen ? "flex" : ""} ${
        shouldHideCursor ? "cursor-none [&_*]:cursor-none" : ""
      }`} // if full screen, make it a flex container to center the video
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      <AnimatePresence>
        {(!canPlay || !videoUrl) && (
          <motion.div
            exit={{
              opacity: 0,
              scale: [1, 0.8, 1],
            }}
            transition={{ duration: 0.5 }}
            className="absolute inset-0 z-30 bg-second-color"
          >
            <div className={`animate-skeleton absolute inset-0`}></div>
          </motion.div>
        )}
      </AnimatePresence>
      <div
        className="absolute inset-0 z-10 cursor-pointer"
        onClick={togglePlay}
      ></div>
      <AnimatePresence>
        {/* if hovering and active, or video is paused - show control elements */}
        {((isHovering && !isIdle) || !isPlaying) && (
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
            className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-main-color/50 via-main-color/20 to-main-color/0 z-20 p-4 pt-3"
          >
            {/* play/pause button, volume, times (numbers and scrollbar), full screen, pip  */}

            {/* container for all the top part: */}
            <div className="flex justify-between">
              {/* container for the left part: */}
              <div className="flex gap-4">
                {/* play icon: */}
                <button
                  onClick={togglePlay}
                  className="backdrop-blur-xl p-2 rounded-lg"
                  title={isPlaying ? t("pause") : t("play")}
                >
                  {isPlaying ? (
                    <svg className="w-6 h-6">
                      <path d="M0 0h24v24H0z" fill="none" />
                      <path
                        d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"
                        className="fill-option-text-color"
                      />
                    </svg>
                  ) : (
                    <svg className="w-6 h-6">
                      <path d="M0 0h24v24H0z" fill="none" />
                      <path
                        d="M8 5v14l11-7z"
                        className="fill-option-text-color"
                      />
                    </svg>
                  )}
                </button>
                {/* time */}
                <div className="flex items-center gap-2 backdrop-blur-xl p-2 rounded-lg">
                  <span className="text-option-text-color">
                    {formatTime(playedSeconds)}
                  </span>
                  <span className="text-option-text-color/70">/</span>
                  <span className="text-option-text-color">
                    {formatTime(duration)}
                  </span>
                </div>
              </div>
              {/* container for the right part: */}
              <div className="flex gap-4">
                <button
                  title={isPip ? t("exit-pip") : t("pip")}
                  className="backdrop-blur-xl p-2 rounded-lg"
                  onClick={() => {
                    // if already in pip, exit pip:
                    if (document.pictureInPictureElement) {
                      document.exitPictureInPicture();
                      return;
                    }
                    if (
                      playerRef.current.requestPictureInPicture === undefined
                    ) {
                      if (document.fullscreenElement) {
                        // exit full screen if it's on, otherwise the user won't see the message
                        document.exitFullscreen();
                      }
                      add({
                        title: t("pip-not-supported"),
                      });

                      return;
                    }
                    playerRef.current.requestPictureInPicture();
                  }}
                >
                  {isPip ? (
                    <svg
                      viewBox="0 0 24 24"
                      className="w-6 h-6 fill-option-text-color"
                    >
                      <path d="M21 3H3c-1.11 0-2 .89-2 2v12c0 1.1.89 2 2 2h5v2h8v-2h5c1.1 0 1.99-.9 1.99-2L23 5c0-1.11-.9-2-2-2zm0 14H3V5h18v12z"></path>
                    </svg>
                  ) : (
                    <svg
                      viewBox="0 0 24 24"
                      className="w-6 h-6 fill-option-text-color"
                    >
                      <path d="M19 11h-8v6h8v-6zm4 8V4.98C23 3.88 22.1 3 21 3H3c-1.1 0-2 .88-2 1.98V19c0 1.1.9 2 2 2h18c1.1 0 2-.9 2-2zm-2 .02H3V4.97h18v14.05z"></path>
                    </svg>
                  )}
                </button>

                <button
                  title={isFullScreen ? t("exit-fullscreen") : t("fullscreen")}
                  className="backdrop-blur-xl p-2 rounded-lg"
                  onClick={() => {
                    // all we need to do is exit/enter full screen, the state will be updated automatically by the event listener in useEffect
                    if (isFullScreen) {
                      document.exitFullscreen();
                      return;
                    }
                    // first exit pip if in pip, and only after that enter full screen:
                    if (document.pictureInPictureElement) {
                      document.exitPictureInPicture();
                    }

                    containerRef.current.requestFullscreen();
                  }}
                >
                  {isFullScreen ? (
                    <svg
                      viewBox="0 0 24 24"
                      className="w-6 h-6 fill-option-text-color"
                    >
                      <path d="M5 16h3v3h2v-5H5v2zm3-8H5v2h5V5H8v3zm6 11h2v-3h3v-2h-5v5zm2-11V5h-2v5h5V8h-3z"></path>
                    </svg>
                  ) : (
                    <svg
                      className="w-6 h-6 fill-option-text-color"
                      focusable="false"
                      viewBox="0 0 24 24"
                    >
                      <path d="M7 14H5v5h5v-2H7v-3zm-2-4h2V7h3V5H5v5zm12 7h-3v2h5v-5h-2v3zM14 5v2h3v3h2V5h-5z"></path>
                    </svg>
                  )}
                </button>
              </div>
            </div>
            {/* container for the progress bar */}

            {/*
              We don't want transition for drags on the progress bar, only for clicks. Because when clicked - show nice transition for the new time, but when dragged - let the user drag the progress bar smoothly without any transition
              So we want to tell the difference between a click on the progress bar and a drag on the progress bar
              steps: 
              1. when the user clicks on the progress bar, set isStillClicked to true, and set a setTimeOut to check later if the user is still dragging or not. 
                    if the user is still dragging after 100ms, set isDraggingProgressBar to true...
              2. when the user releases the mouse, set isStillClicked to false and set isDraggingProgressBar to false (for cases where the user started dragging)
              */}

            <div
              onPointerDown={() => {
                isStillClickedRef.current = true;
                // don't set the state immediately, wait and see if the user is dragging or it's just a click
                setTimeout(() => {
                  if (isStillClickedRef.current) {
                    setIsDraggingProgressBar(true);
                  }
                }, 100);
              }}
              onPointerUp={() => {
                isStillClickedRef.current = false;
                setIsDraggingProgressBar(false);
              }}
              className={`group w-full backdrop-blur-xl rounded-lg h-2 mt-2 bg-option-text-color/30 relative hover:scale-y-150 ${
                // for mobile, if dragging - sometimes hover effect doesn't apply
                isDraggingProgressBar ? "scale-y-150" : ""
              } transition-all ${
                focusOnProgressBar
                  ? "outline-dashed outline-1 outline-main-color"
                  : ""
              }`}
            >
              {/* the element that shows how much we progressed in the progress bar: */}
              <div
                style={{
                  width: currentWidthOfProgressBar + "%",
                }}
                className={`bg-gradient-to-tl from-main-color to-third-color rounded-lg h-full relative ${
                  isDraggingProgressBar ? "transition-none" : "transition-all"
                }`}
              >
                {/* thumb indicator (round little thing in the progress bar) */}
                <div
                  // onClick={() => {
                  //   console.log("clicked on thumb");
                  // }}
                  className={`rounded-full h-4 w-4 bg-third-color absolute ${
                    locale === "en"
                      ? "right-0 translate-x-1/2"
                      : "left-0 -translate-x-1/2"
                  } top-1/2 -translate-y-1/2 scale-0 group-hover:scale-x-100 group-hover:scale-y-75 ${
                    // for mobile, if dragging - sometimes hover effect doesn't apply
                    isDraggingProgressBar ? "scale-x-100 scale-y-75" : ""
                  } transition-transform`}
                ></div>
              </div>
              {/* the progress bar is actually <input type="range"> under the hood, invisible but on top (and that's why clickable and interactive): */}
              <input
                aria-label={t("progress-bar")}
                onFocus={() => {
                  setFocusOnProgressBar(true);
                }}
                onBlur={() => {
                  setFocusOnProgressBar(false);
                }}
                type="range"
                min={0}
                max={duration}
                value={playedSeconds}
                onChange={e => {
                  setPlayedSeconds(e.target.value);
                  playerRef.current.currentTime = e.target.value;
                }}
                className="absolute inset-0 opacity-0 w-full h-full cursor-pointer" // w-full for firefox. inset-0 doesn't make the input type="range" take the whole width in firefox
              />
            </div>
          </m.div>
        )}
      </AnimatePresence>
      {videoUrl && loaded && (
        // <ReactPlayer
        //   // config={{
        //   //   attributes: {
        //   //     preload: "metadata",
        //   //   },
        //   // }}
        //   ref={playerRef}
        //   onEnded={() => setIsPlaying(false)}
        //   onProgress={handleProgress}
        //   playing={isPlaying}
        //   width="unset"
        //   height="unset"
        //   onDuration={d => setDuration(d)}
        //   className={`[&_video]:block [&_video]:max-h-[70vh]`}
        //   onCanPlay={() => {
        //     setCanPlay(true);
        //   }}
        //   url={videoUrl}
        // />

        <video
          ref={playerRef}
          src={videoUrl}
          className={`block mx-auto cursor-pointer w-full ${
            isFullScreen ? "max-h-[100vh]" : "max-h-[80vh]"
          }`}
          onCanPlay={() => {
            setCanPlay(true);
          }}
          onTimeUpdate={handleTimeUpdate}
          onEnded={() => setIsPlaying(false)}
        ></video>
      )}
    </div>
  );
}
