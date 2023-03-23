import { useState } from "react";
import { useEffect, useRef } from "react";
import Button from "./Button";
import Modal from "./Modal";
import { useTranslation } from "next-i18next";

export default function CountdownModal({
  title,
  nextCallback,
  cancelCallback,
}) {
  const [count, setCount] = useState(10);
  const downloadTimer = useRef(null);
  const { t } = useTranslation("menu");

  useEffect(() => {
    downloadTimer.current = setInterval(() => {
      setCount(prev => prev - 1);
    }, 1000);
    return () => clearInterval(downloadTimer.current);
  }, []);

  useEffect(() => {
    if (count === 0) {
      clearInterval(downloadTimer.current);
      nextCallback();
    }
  }, [count, nextCallback]);

  return (
    <Modal>
      <div className={`flex flex-col text-center text-option-text-color`}>
        <b>{title}</b>
        <span className={`text-7xl`}>{count}</span>
        <Button onClick={cancelCallback}>
          {t("actions.cancel").toUpperCase()}
        </Button>
      </div>
    </Modal>
  );
}
