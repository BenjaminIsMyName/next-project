import { useRef } from "react";
import { useCallback } from "react";
import { useState } from "react";

export default function useToast() {
  // inspired by https://github.com/candraKriswinarto/react-toast-component/blob/main/src/components/toast/Toast.js
  const [alerts, setAlerts] = useState([]);
  const count = useRef(0); // we cannot use the array's length for the id because we also remove stuff

  function add(obj) {
    let id = count.current++;
    setAlerts(prev => {
      obj.id = id;
      return [...prev, obj];
    });
    // count the words in the toast and set time accordingly:
    const words = obj.title.split(" ").length;
    const time = Math.max(words * 1000, 3000); // at least 3 seconds, otherwise it's too fast and might look like a bug
    setTimeout(() => remove(id), time);
    return id;
  }

  const remove = useCallback(id => {
    setAlerts(prev => {
      let filtered = prev.filter(i => i.id !== id);
      return filtered;
    });
  }, []);

  return [add, remove, alerts];
}
