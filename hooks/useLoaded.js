import { useEffect, useState } from "react";
// see: https://stackoverflow.com/a/56525858
// Without it, there will be an error after logging in and refreshing the page
export default function useLoaded() {
  const [loaded, setLoaded] = useState(false);
  useEffect(() => setLoaded(true), []);
  return loaded;
}
