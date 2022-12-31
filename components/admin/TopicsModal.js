import axios from "axios";
import { motion as m } from "framer-motion";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import GoBackButton from "../GoBackButton";
import TrashIcon from "../icons/TrashIcon";
import Loading from "../Loading";

export default function TopicsModal({ closeCallback }) {
  const { locale } = useRouter();
  const [topics, setTopics] = useState([]);

  useEffect(() => {
    async function fetchAll() {
      const { data } = await axios.get("/api/topics/getAll");
      console.log(typeof data.topics[0]._id);

      setTopics(data.topics);
    }

    fetchAll();
  }, []);

  return (
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
        } bg-main-color bg-opacity-40 backdrop-blur-3xl p-2 flex rounded-full`}
      >
        <GoBackButton callback={closeCallback} />
      </div>

      <input
        type={"search"}
        className={`block my-5 mx-auto bg-main-color bg-opacity-80
        shadow-inner rounded-3xl p-2 text-center backdrop-blur-3xl`}
        placeholder={"Search a topic..."}
      />

      <div className="flex flex-col gap-4">
        {topics.length ? "" : <Loading />}
        {topics.map(t => (
          <TopicToPick
            key={t._id}
            id={t._id}
            text={locale === "en" ? t.english : t.hebrew}
          />
        ))}
      </div>
    </m.div>
  );
}

function TopicToPick({ text, id }) {
  return (
    <div className="bg-main-color p-4 flex justify-between">
      <div className="flex gap-3">
        <input type={"checkbox"} id={id} className={"accent-third-color"} />
        <label htmlFor={id}>{text}</label>
      </div>
      <button className="fill-error-color w-5 h-5">
        <TrashIcon />
      </button>
    </div>
  );
}
