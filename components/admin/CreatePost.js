import { useState } from "react";
import Error from "../Error";
import axios from "axios";
import Loading from "../Loading";
import { useTranslation } from "next-i18next";
import Balancer from "react-wrap-balancer";
import { useRouter } from "next/router";
import Input from "../Input";
import { titleError } from "../../util/validate";
import SelectedTopic from "./SelectedTopic";
import Topics from "./Topics";
import SearchTopic from "./SearchTopic";
import { AnimatePresence, motion } from "framer-motion";
import CreateTopic from "./CreateTopic";

export default function CreatePost() {
  const { t } = useTranslation("admin");
  const router = useRouter();
  const locale = router.locale;
  const [file, setFile] = useState(null);
  const StatusEnum = {
    start: "The upload process didn't start yet",
    loading: "Trying to access the backend and save the post",
    error: "Something went wrong while posting",
    done: "Post is already in DB and in S3",
  };
  const [status, setStatus] = useState(StatusEnum.start);
  const [title, setTitle] = useState("");

  const ModalEnum = {
    none: "No modal is opened",
    search: "List of the topics",
    create: "Create a new topic",
  };

  const [modalOpen, setModalOpen] = useState(ModalEnum.none);
  const [selectedTopics, setSelectedTopics] = useState([]);

  function handleFileSelect(e) {
    setFile(e.target.files[0]);
  }

  async function uploadFile() {
    setStatus(StatusEnum.loading);
    try {
      let { data } = await axios.get("/api/getUrlToUploadVideo", {
        params: { name: file.name, type: file.type },
      });

      const url = data.url;
      const objectS3key = data.objectS3key;

      await axios.put(url, file, {
        headers: {
          "Content-type": file.type,
          "Access-Control-Allow-Origin": "*",
        },
      });

      removeSelectedFile();
      const res = await axios.post("/api/savePostToDb", {
        title,
        objectS3key,
      });
      router.push(`/post/${res.data}`);
    } catch (error) {
      console.log(`error is`, error);
      setStatus(StatusEnum.error);
    }
  }

  function removeSelectedFile() {
    setFile(null);
    // we need the following in case the user select a file > delete it > select the same file again.
    // This way, the "onChange" will be triggered.
    document.querySelector("#uploadInput").value = "";
  }
  return (
    <motion.div
      layout
      className={`
      flex flex-col p-[min(20px,3%)] gap-3 text-center
      bg-second-color text-option-text-color 
      md:p-5 md:border-[20px] border-main-color 
      border-0 relative
        `}
    >
      <div>
        <Balancer>
          <span className="block text-4xl px-2 mt-4 text-center">
            {t("create-post-title")}
          </span>
        </Balancer>
      </div>
      <Input
        translationFile="admin"
        name={"title"}
        checkErrorCallback={titleError}
        valueObj={{ title }}
        removeDefaultStyle={true}
        type={"text"}
        placeholder={t("title-placeholder") + "..."}
        onChange={e => setTitle(e.target.value)}
        className={
          "bg-main-color shadow-inner shadow-shadows-color p-2 rounded-3xl text-center"
        }
      />
      <Topics
        addTopicCallback={() => setModalOpen(ModalEnum.search)}
        setSelectedTopics={setSelectedTopics}
        selectedTopics={selectedTopics}
      />

      <AnimatePresence>
        {modalOpen === ModalEnum.search && (
          <SearchTopic
            closeCallback={() => setModalOpen(ModalEnum.none)}
            setSelectedTopics={setSelectedTopics}
            selectedTopics={selectedTopics}
            createCallback={() => setModalOpen(ModalEnum.create)}
          />
        )}

        {modalOpen === ModalEnum.create && (
          <CreateTopic
            closeCallback={() => setModalOpen(ModalEnum.search)}
            setSelectedTopics={setSelectedTopics}
            selectedTopics={selectedTopics}
          />
        )}
      </AnimatePresence>

      <div className={`bg-main-color h-80 w-full`}>
        {file === null ? (
          <label
            tabIndex="0"
            htmlFor="uploadInput"
            className={`p-3 text-3xl bg-third-color bg-opacity-40 w-full h-full cursor-pointer flex items-center justify-center`}
          >
            <Balancer>
              <span>{t("select")}</span>
            </Balancer>
          </label>
        ) : (
          <div
            className={`flex gap-3 flex-col p-[min(20px,5%)] w-full h-full justify-center`}
          >
            <span className="text-xl">{t("this-was-selected")}:</span>
            <p>{file.name}</p>
            <button
              type="button"
              className={`bg-error-color cursor-pointer p-3`}
              onClick={removeSelectedFile}
            >
              {t("delete-file").toUpperCase()}
            </button>
          </div>
        )}
        <input
          className={`hidden`}
          id="uploadInput"
          type={"file"}
          onChange={handleFileSelect}
          accept="video/*"
        />
      </div>
      <button
        disabled={file === null || titleError(title)}
        onClick={uploadFile}
        className={
          "bg-main-color p-3 text-third-color disabled:opacity-60 disabled:cursor-not-allowed"
        }
      >
        {t("create-btn")}
      </button>

      {status === StatusEnum.loading && <Loading />}
      {status === StatusEnum.error && (
        <Error tryAgainCallback={uploadFile} error={t("error")} />
      )}
    </motion.div>
  );
}
