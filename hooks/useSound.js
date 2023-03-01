import { useRef, useEffect } from "react";

export default function useSound() {
  const isSound = useRef(true); // if the user choose in settings not to hear sounds
  const audios = useRef({
    // you can add more sounds here (don't forget to add the audio url in the useEffect at the bottom)
    like: null,
    // click: null,
  });

  let obj = {};

  for (let key in audios.current) {
    obj[key] = {
      play: () => {
        isSound.current && audios.current[key] && audios.current[key].play();
      },
      pause: () => {
        audios.current[key] && audios.current[key].pause();
      },
      reset: () => {
        // if we paused the sound in the middle and want to start from the beginning
        audios.current[key] && (audios.current[key].currentTime = 0);
      },
    };
  }

  const audiosWrapper = useRef(obj); // can be used like "audiosWrapper.current.like.play()"

  function toggleSound() {
    isSound.current = !isSound.current;
    if (!isSound.current) {
      // if the sound got muted, pause all sounds
      for (let key in audiosWrapper.current) {
        audiosWrapper.current[key].pause();
        audiosWrapper.current[key].reset();
      }
    } else {
      // if the sound got unmuted, play a click sound:
      // audiosWrapper.current.click.play();
    }
  }

  useEffect(() => {
    // we need this useEffect because we cannot use Audio object on the server.
    // so useEffect will make sure it will run only on the client-side
    audios.current.like = new Audio("/sounds/like.ogg");
    // audios.current.click = new Audio("/click-sound.wav");
  }, []);

  return [audiosWrapper, toggleSound, isSound];
}
