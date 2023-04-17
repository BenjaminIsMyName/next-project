import { useContext, useState } from "react";
import Error from "../Error";
import axios from "axios";
import Loading from "../Loading";
import { useTranslation } from "next-i18next";
import Balancer from "react-wrap-balancer";
import { useRouter } from "next/router";
import Input from "../Input";
import { titleError } from "../../util/validate";
import Topics from "./Topics";
import SearchTopic from "./SearchTopic";
import { AnimatePresence, motion } from "framer-motion";
import CreateOrEditTopic from "./CreateOrEditTopic";
import { AlertContext } from "../../context/AlertContext";
import ButtonGroup from "./ButtonGroup";

export default function CreatePost() {
  const { t } = useTranslation(["admin"]);
  const router = useRouter();

  const ContentTypeEnum = {
    video: "video, default",
    text: "text",
  };

  const [contentType, setContentType] = useState(ContentTypeEnum.video);

  const buttons = Object.keys(ContentTypeEnum).map(key => ({
    set: () => setContentType(ContentTypeEnum[key]),
    text: t(`content-type.${key}`, { ns: "admin" }), // TODO - add to i18n
    isSelected: contentType === ContentTypeEnum[key],
    key,
  }));

  const [file, setFile] = useState(null);
  const StatusEnum = {
    start: "The upload process didn't start yet",
    loading: "Trying to access the backend and save the post",
    error: "Something went wrong while posting",
  };
  const [status, setStatus] = useState(StatusEnum.start);
  const [title, setTitle] = useState("");
  const { add } = useContext(AlertContext);

  const ModalEnum = {
    none: "No modal is opened",
    search: "List of the topics",
    create: "Create a new topic",
    edit: "Edit existing topic",
  };

  const [modalOpen, setModalOpen] = useState(ModalEnum.none);
  const [topicEditing, setTopicEditing] = useState(null);
  const [selectedTopics, setSelectedTopics] = useState([]);

  function handleFileSelect(e) {
    var fileSize = (e.target.files[0].size / 1024 / 1024).toFixed(3); // MB
    if (fileSize > 300) {
      add({
        title: t("alerts.file-too-big", { fileSize: fileSize, ns: "admin" }),
      });
      removeSelectedFile();
      return;
    }

    setFile(e.target.files[0]);
  }

  async function uploadFile() {
    setStatus(StatusEnum.loading);
    try {
      // get one-time-url to upload the file directly from the client side
      let { data } = await axios.get("/api/getUrlToUploadVideo", {
        params: { name: file.name, type: file.type, size: file.size },
      });

      const stuff = {
        ...data.info.fields,
        // "Content-Type": file.type, // needed if we want to limit the file type (e.g. only mp4)
        file,
      };

      const formData = new FormData();
      for (const name in stuff) {
        formData.append(name, stuff[name]);
      }

      const url = data.info.url;
      const objectS3key = data.objectS3key;

      await axios.post(url, formData); // upload the file to S3

      // create the post
      const res = await axios.post("/api/savePostToDb", {
        title,
        objectS3key,
        topics: selectedTopics.map(s => s._id),
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
    // must use another div to change the overflow-x, because it effects the overflow-y too.
    // see: https://stackoverflow.com/questions/6421966/css-overflow-x-visible-and-overflow-y-hidden-causing-scrollbar-issue
    <div className="overflow-x-hidden">
      <motion.div
        layout
        className={`
      flex flex-col p-[min(20px,3%)] gap-3 text-center
      bg-second-color text-option-text-color 
      md:p-5 md:border-[20px] border-main-color 
      border-0 relative
        `}
      >
        <div
          className={`flex flex-col gap-3 ${
            status === StatusEnum.loading ? "hidden" : "block"
          }`}
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
            className={`bg-main-color shadow-inner shadow-shadows-color p-2 
        rounded-3xl text-center`}
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
                editCallback={topicObj => {
                  setTopicEditing(topicObj);
                  setModalOpen(ModalEnum.edit);
                }}
              />
            )}

            {modalOpen === ModalEnum.create && (
              <CreateOrEditTopic
                closeCallback={() => setModalOpen(ModalEnum.search)}
                setSelectedTopics={setSelectedTopics}
                selectedTopics={selectedTopics}
              />
            )}

            {modalOpen === ModalEnum.edit && (
              <CreateOrEditTopic
                closeCallback={() => setModalOpen(ModalEnum.search)}
                setSelectedTopics={setSelectedTopics}
                selectedTopics={selectedTopics}
                topicToEdit={topicEditing}
              />
            )}
          </AnimatePresence>

          <ButtonGroup buttons={buttons} />
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
              accept="video/*" // if we want to allow all video types
              // accept="video/mp4" // if we want to allow only MP4... MP4 is supported by all popular browsers
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
        </div>
        {status === StatusEnum.loading && <Loading />}
        {status === StatusEnum.error && (
          <Error
            tryAgainCallback={() => {
              if (file !== null && !titleError(title)) {
                uploadFile();
              } else {
                add({
                  title: t("alerts.cannot-try-again", { ns: "admin" }),
                });
              }
            }}
            error={t("error")}
          />
        )}
      </motion.div>
    </div>
  );
}
