import { useState } from "react";
import Error from "../Error";
import axios from "axios";
import Loading from "../Loading";
import { useTranslation } from "next-i18next";
import Balancer from "react-wrap-balancer";
import { useRouter } from "next/router";

export default function CreatePost() {
  const { t } = useTranslation("admin");
  const router = useRouter();

  const [file, setFile] = useState(null);
  const StatusEnum = {
    start: "The upload process didn't start yet",
    loading: "Trying to access the backend and save the post",
    error: "Something went wrong while posting",
    done: "Post is already in DB and in S3",
  };
  const [status, setStatus] = useState(StatusEnum.start);
  const [title, setTitle] = useState("");

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
      console.log(url);
      await axios.put(url, file, {
        headers: {
          "Content-type": file.type,
          "Access-Control-Allow-Origin": "*",
        },
      });

      removeSelectedFile();
      const videoUrl = url.split("?")[0];
      const res = await axios.post("/api/savePostToDb", {
        url: videoUrl,
        title,
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
    <div
      className={`bg-second-color text-option-text-color w-full flex flex-col p-[min(20px,3%)] gap-3 text-center`}
    >
      <div>
        <Balancer>
          <span className="block text-4xl px-2 text-center">
            {t("create-post-title")}
          </span>
        </Balancer>
      </div>
      <input
        type={"text"}
        placeholder={t("title-placeholder") + "..."}
        onChange={e => setTitle(e.target.value)}
        className={
          "bg-main-color shadow-inner shadow-shadows-color p-2 rounded-3xl text-center"
        }
      />
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
        disabled={file === null}
        onClick={uploadFile}
        className={"bg-main-color p-3 text-third-color"}
      >
        {t("create-btn")}
      </button>

      {status === StatusEnum.loading && <Loading />}
      {status === StatusEnum.error && (
        <Error tryAgainCallback={uploadFile} error={t("error")} />
      )}
    </div>
  );
}
