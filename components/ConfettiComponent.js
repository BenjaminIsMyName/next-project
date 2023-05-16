import useLoaded from "@h/useLoaded";
import Confetti from "react-confetti";
import { useWindowSize } from "react-use";

export default function ConfettiComponent({ confettiKey }) {
  const loaded = useLoaded();

  const { width, height } = useWindowSize();

  return (
    loaded && // we need to wait for the page to be loaded to get the correct width and height
    confettiKey > 0 && ( // don't show confetti on first render (page load, key did not change yet)
      <Confetti
        width={width}
        height={height}
        className="!fixed" // fixed position, so that it doesn't move when scrolling
        recycle={false} // stop confetti when it's done, do not repeat forever
        key={confettiKey} // when the key changes, the confetti will be triggered. the function playConfetti in _app.js will change the key...
      />
    )
  );
}
