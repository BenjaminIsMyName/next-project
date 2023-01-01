import axios from "axios";
import { motion as m } from "framer-motion";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import GoBackButton from "../GoBackButton";
import TrashIcon from "../icons/TrashIcon";
import Loading from "../Loading";
import EditIcon from "../icons/EditIcon";
import FocusTrap from "focus-trap-react";

export default function TopicsModal({
  closeCallback,
  selectedTopics,
  setSelectedTopics,
}) {
  const { locale } = useRouter();
  const [topics, setTopics] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    async function fetchAll() {
      const { data } = await axios.get("/api/topics/getAll");
      setTopics(data.topics);
    }

    fetchAll();
  }, []);

  const searchRef = useRef();
  useEffect(() => searchRef.current && searchRef.current.focus(), []);

  return (
    <FocusTrap focusTrapOptions={{ allowOutsideClick: true }}>
      <m.div
        initial={{ scale: 0, rotate: 40, opacity: 0 }}
        animate={{ scale: 1, rotate: 0, opacity: 1 }}
        exit={{ scale: 0, rotate: 40, opacity: 0 }}
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

        <input
          ref={searchRef}
          type={"search"}
          className={`block mt-28 mb-5 mx-auto bg-main-color bg-opacity-80
        shadow-inner rounded-3xl p-2 text-center backdrop-blur-3xl outline-third-color 
        transition-all duration-700 w-[200px] max-w-[85%] focus:w-[300px] focus:rounded-xl focus:outline-none `}
          placeholder={"Search a topic..."}
          onChange={e => setSearchTerm(e.target.value)}
          value={searchTerm}
        />

        <div className="flex flex-col gap-4">
          {topics.length ? "" : <Loading />}
          {topics
            .filter(
              t =>
                t.hebrew.toLowerCase().includes(searchTerm.toLowerCase()) ||
                t.english.toLowerCase().includes(searchTerm.toLowerCase())
            )
            .map(t => (
              <TopicToPick
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
                  console.log(selectedTopics);
                }}
              />
            ))}
        </div>
      </m.div>
    </FocusTrap>
  );
}

function TopicToPick({ text, id, isSelected, toggle }) {
  return (
    <div className="bg-main-color p-4 flex justify-between">
      <div className="flex gap-3">
        <input
          type={"checkbox"}
          id={id}
          className={"accent-third-color"}
          checked={isSelected}
          onChange={toggle}
        />
        <label htmlFor={id}>{text}</label>
      </div>
      <div className="flex gap-2 items-center">
        <button className="w-5 h-5 fill-third-color">
          <EditIcon />
        </button>
        <button className="fill-error-color w-5 h-5">
          <TrashIcon />
        </button>
      </div>
    </div>
  );
}
