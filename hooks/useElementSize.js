import { useEffect, useState } from "react";

export default function useElementSize() {
  // Mutable values like 'ref.current' aren't valid dependencies
  // because mutating them doesn't re-render the component.
  // Instead, we use a state as a ref to be reactive.
  const [ref, setRef] = useState(null);
  const [size, setSize] = useState({
    width: 0,
    height: 0,
  });

  useEffect(() => {
    function handleSize() {
      setSize({
        width: ref?.offsetWidth || 0,
        height: ref?.offsetHeight || 0,
      });
    }
    handleSize();
    window.addEventListener("resize", handleSize);
    return () => window.removeEventListener("resize", handleSize);
  }, [ref]);

  return [setRef, size];
}
