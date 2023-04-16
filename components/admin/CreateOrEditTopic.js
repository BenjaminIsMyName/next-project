import axios from "axios";
import { useRouter } from "next/router";
import { useState } from "react";
import GoBackButton from "../GoBackButton";
import Input from "../Input";
import useFormData from "../../hooks/useFormData";
import { topicError } from "../../util/validate";
import { useTranslation } from "next-i18next";
import Container from "./Container";

export default function CreateOrEditTopic({
  closeCallback,
  setSelectedTopics,
  topicToEdit, // if we are in "edit" mode
  shouldAnimateIn,
  shouldAnimateOut,
}) {
  const { locale } = useRouter();
  const { t } = useTranslation(["common", "admin"]);
  const inputsDefault = {
    hebrew: topicToEdit?.hebrew || "",
    english: topicToEdit?.english || "",
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
      if (topicToEdit) {
        await axios.patch("/api/topics/edit", {
          id: topicToEdit._id,
          ...inputsData,
        });
        setSelectedTopics(prev =>
          prev.map(t =>
            t._id == topicToEdit._id ? { _id: t._id, ...inputsData } : t
          )
        );
      } else {
        await axios.post("/api/topics/create", inputsData);
      }
      closeCallback();
    } catch (error) {
      console.log(`error in submitNewTopic`, error);
      setStatus(StatusEnum.error);
    }
  }

  return (
    <Container
      shouldAnimateIn={shouldAnimateIn}
      shouldAnimateOut={shouldAnimateOut}
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
          placeholder={t("placeholders.name-in-english", { ns: "admin" })}
          translationFile="admin"
        />
        <Input
          valueObj={inputsData}
          name={"hebrew"}
          checkErrorCallback={topicError}
          onChange={handleInputChange}
          placeholder={t("placeholders.name-in-hebrew", { ns: "admin" })}
          translationFile="admin"
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
    </Container>
  );
}
