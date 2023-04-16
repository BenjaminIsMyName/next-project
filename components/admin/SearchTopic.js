import axios from "axios";
import { motion as m } from "framer-motion";
import { useRouter } from "next/router";
import {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import GoBackButton from "../GoBackButton";
import TrashIcon from "../icons/TrashIcon";
import Loading from "../Loading";
import EditIcon from "../icons/EditIcon";
import FocusTrap from "focus-trap-react";
import { AlertContext } from "../../context/AlertContext";
import { useTranslation } from "next-i18next";
import Error from "../Error";
import Container from "./Container";

export default function SearchTopic({
  closeCallback,
  selectedTopics,
  setSelectedTopics,
  createCallback,
  editCallback,
}) {
  const { locale } = useRouter();
  const [topics, setTopics] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [error, setError] = useState("");
  const StatusEnum = useMemo(
    () => ({
      init: "Initial state",
      fetching: "Trying to fetch topics from DB",
      fetched: "Topics are fetched",
      error: "Error while fetching topics",
    }),
    []
  );

  const [status, setStatus] = useState(StatusEnum.init);
  const { t } = useTranslation(["common", "admin"]);
  const fetchAll = useCallback(async () => {
    setStatus(StatusEnum.fetching);
    try {
      const { data } = await axios.get("/api/topics/getAll");
      setTopics(data.topics);
      setStatus(StatusEnum.fetched);
    } catch (error) {
      console.log(`error in SearchTopic.js:`, error);
      setStatus(StatusEnum.error);
      setError(error.message);
    }
  }, [StatusEnum.error, StatusEnum.fetched, StatusEnum.fetching]); // same as [] because no dependency is going to change

  useEffect(() => {
    fetchAll();
  }, [fetchAll]); // same as [] because fetchAll is never going to change

  const searchRef = useRef();
  useEffect(() => searchRef.current && searchRef.current.focus(), []);

  const filteredTopics = topics.filter(
    t =>
      t.hebrew.toLowerCase().trim().includes(searchTerm.trim().toLowerCase()) ||
      t.english.toLowerCase().trim().includes(searchTerm.trim().toLowerCase())
  );

  return (
    <Container>
      {/* don't allow tabs outside of here, but allow clicking on the menu  */}
      <div
        className={`fixed top-4 ${
          locale === "en" ? "left-4" : "right-4"
        } bg-main-color bg-opacity-40 backdrop-blur-3xl p-2 flex rounded-full z-10`}
      >
        <GoBackButton callback={closeCallback} />
      </div>

      <input
        ref={searchRef}
        type={"search"}
        className={`block mt-28 mb-5 mx-auto bg-main-color bg-opacity-80
        shadow-inner rounded-3xl p-2 text-center backdrop-blur-3xl outline-third-color 
        transition-all duration-700 w-[200px] max-w-[85%] focus:w-[300px] focus:rounded-xl focus:outline-none `}
        placeholder={t("placeholders.search-topic", { ns: "admin" }) + "..."}
        onChange={e => setSearchTerm(e.target.value)}
        value={searchTerm}
      />

      <div className="flex flex-col gap-4 p-7">
        {status === StatusEnum.fetching && <Loading />}
        {/* if search gave 0 results: */}
        {topics.length > 0 && filteredTopics.length === 0 && (
          <NoResults createCallback={createCallback} />
        )}
        {/* if error */}
        {status === StatusEnum.error && (
          <div>
            <Error tryAgainCallback={fetchAll} error={error} />
          </div>
        )}
        {filteredTopics.map(t => (
          <TopicToPick
            editCallback={() => editCallback(t)}
            key={t._id}
            id={t._id}
            text={locale === "en" ? t.english : t.hebrew}
            isSelected={selectedTopics.some(obj => obj._id === t._id)}
            toggle={() => {
              if (selectedTopics.some(obj => t._id === obj._id))
                setSelectedTopics(prev =>
                  prev.filter(obj => t._id !== obj._id)
                );
              else setSelectedTopics(prev => [...prev, t]);
            }}
            handleDeleteCallback={id =>
              setSelectedTopics(prev => prev.filter(obj => id !== obj._id))
            }
          />
        ))}
      </div>
    </Container>
  );
}

function TopicToPick({
  text,
  id,
  isSelected,
  toggle,
  handleDeleteCallback,
  editCallback,
}) {
  const StatusEnum = {
    init: "Initial state",
    deleting: "Trying to delete topic from DB",
    deleted: "Topic is deleted",
  };

  const [deleteStatus, setDeleteStatus] = useState(StatusEnum.init);
  const { add } = useContext(AlertContext);
  const { t } = useTranslation(["common", "admin"]);
  async function handleDelete() {
    setDeleteStatus(StatusEnum.deleting);
    try {
      await axios.delete("/api/topics/deleteTopic", {
        data: { topicId: id },
      });
      setDeleteStatus(StatusEnum.deleted);
      handleDeleteCallback(id); // delete the topic from the selected topics
    } catch (error) {
      setDeleteStatus(StatusEnum.init);
      add({ title: t("alerts.failed-to-delete", { ns: "admin" }) });
    }
  }

  if (deleteStatus === StatusEnum.deleted)
    return (
      <div className="bg-error-color p-4 flex justify-between text-option-text-color">
        <span className="block m-auto text-center">
          {t("deleted", { ns: "common" }).toUpperCase() + "!"}
        </span>
      </div>
    );

  if (deleteStatus === StatusEnum.deleting)
    return (
      <div className="bg-error-color p-4 flex justify-between text-option-text-color bg-opacity-30">
        <span className="block m-auto text-center">
          {t("deleting", { ns: "common" }) + "..."}
        </span>
      </div>
    );

  return (
    <div
      className="bg-main-color p-4 flex justify-between shadow-xl shadow-shadows-color/20 rounded-3xl
      transition-all hover:border-third-color/50 border-4 border-third-color/0 duration-500"
    >
      <div className="flex gap-3 w-[calc(100%-56px)]">
        <input
          type={"checkbox"}
          id={id}
          className={"accent-third-color w-4"}
          checked={isSelected}
          onChange={toggle}
        />
        <label
          htmlFor={id}
          className="overflow-ellipsis whitespace-nowrap overflow-hidden"
        >
          {text}
        </label>
      </div>
      <div className="flex gap-4 items-center w-[56px]">
        <button
          className="w-5 h-5 fill-third-color"
          onClick={() => editCallback()}
        >
          <EditIcon />
        </button>
        <button className="fill-error-color w-5 h-5" onClick={handleDelete}>
          <TrashIcon />
        </button>
      </div>
    </div>
  );
}

function NoResults({ createCallback }) {
  const { t } = useTranslation(["admin", "common"]);
  return (
    <div className="flex flex-col gap-2 items-center">
      <div className="text-error-color">
        {t("no-results", { ns: "common" })}
      </div>
      <button
        className="bg-main-color p-3 rounded-lg text-third-color"
        onClick={createCallback}
      >
        {t("create-topic", { ns: "admin" }).toUpperCase()}
      </button>
    </div>
  );
}
