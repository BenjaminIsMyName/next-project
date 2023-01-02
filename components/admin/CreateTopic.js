import axios from "axios";
import { motion as m } from "framer-motion";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import GoBackButton from "../GoBackButton";
import TrashIcon from "../icons/TrashIcon";
import Loading from "../Loading";
import EditIcon from "../icons/EditIcon";
import FocusTrap from "focus-trap-react";
import Input from "../Input";
import useFormData from "../../hooks/useFormData";
import { topicError } from "../../util/validate";
import { useTranslation } from "next-i18next";

export default function CreateTopic({
  closeCallback,
  selectedTopics,
  setSelectedTopics,
}) {
  const { locale } = useRouter();
  const { t } = useTranslation(["common"]);
  const inputsDefault = {
    hebrew: "",
    english: "",
  };

  const { inputsData, handleInputChange } = useFormData(inputsDefault);

  const StatusEnum = {
    init: "Nothing happened yet",
    loading: "Trying to save the new topic",
    error: "Couldn't save the new topic",
  };

  const [status, setStatus] = useState(StatusEnum.init);

  async function submitNewTopic() {
    setStatus(StatusEnum.loading);
    try {
      await axios.post("/api/topics/create", inputsData);
      closeCallback();
    } catch (error) {
      setStatus(StatusEnum.error);
    }
  }

  return (
    <FocusTrap focusTrapOptions={{ allowOutsideClick: true }}>
      <m.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0, opacity: 0, rotate: 40 }}
        transition={{ ease: "easeIn", duration: 0.2, opacity: 0 }}
        className="absolute inset-0 bg-second-color bg-opacity-80 z-20 backdrop-blur-md"
      >
        <div
          className={`fixed top-4 ${
            locale === "en" ? "left-4" : "right-4"
          } bg-main-color bg-opacity-40 backdrop-blur-3xl p-2 flex rounded-full z-10`}
        >
          <GoBackButton callback={closeCallback} />
        </div>
        <div className="p-6 flex flex-col gap-5 mt-8">
          <Input
            valueObj={inputsData}
            name={"english"}
            checkErrorCallback={topicError}
            onChange={handleInputChange}
            placeholder={"Name in English"}
          />
          <Input
            valueObj={inputsData}
            name={"hebrew"}
            checkErrorCallback={topicError}
            onChange={handleInputChange}
            placeholder={"Name in Hebrew"}
          />
        </div>
        <div>
          <button
            onClick={submitNewTopic}
            disabled={
              topicError(inputsData["english"]) ||
              topicError(inputsData["hebrew"]) ||
              status === StatusEnum.loading
            }
            type="button"
            className={`disabled:opacity-60 disabled:cursor-not-allowed mb-9 w-[80%] m-auto block bg-third-color p-2 mt-2 text-main-color transition-all 
        ${status === StatusEnum.loading ? "bg-opacity-80 rounded-lg" : ""}`}
          >
            {status === StatusEnum.loading
              ? t("loading", { ns: "common" }) + "..."
              : title.length === 0
              ? t("write-something", { ns: "common" }) + "..."
              : status === StatusEnum.error
              ? t("try-again", { ns: "common" })
              : t("save", { ns: "common" })}
          </button>
        </div>
      </m.div>
    </FocusTrap>
  );
}
