import { useEffect } from "react";
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
    setTimeout(() => remove(id), 3000);
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
