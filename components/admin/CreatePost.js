import { useState } from "react";
import Error from "../Error";
import axios from "axios";
import Loading from "../Loading";

export default function CreatePost() {
  const [file, setFile] = useState(null);
  const StatusEnum = {
    start: "The upload process didn't start yet",
    loading: "Trying to access the backend and save the post",
    error: "Something went wrong while posting",
    done: "Post is already in DB and in S3",
  };
  const [status, setStatus] = useState(StatusEnum.start);
  const [title, setTitle] = useState("");
  const [uploadedFile, setUploadedFile] = useState(null);
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
      await axios.post("/api/savePostToDb", {
        url: videoUrl,
        title,
      });
      setUploadedFile(videoUrl);
      setStatus(StatusEnum.done);
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
      <h1>העלאת פוסט</h1>
      <input
        type={"text"}
        placeholder="כותרת"
        onChange={e => setTitle(e.target.value)}
      />
      <div className={`bg-main-color h-80 w-full`}>
        {file === null ? (
          <label
            tabIndex="0"
            htmlFor="uploadInput"
            className={`p-3 text-3xl bg-third-color bg-opacity-40 w-full h-full cursor-pointer flex items-center justify-center`}
          >
            <span>בחר סרטון</span>
          </label>
        ) : (
          <div
            className={`flex gap-3 flex-col p-[min(20px,5%)] w-full h-full justify-center`}
          >
            <h2>קובץ זה נבחר:</h2>
            <p>{file.name}</p>
            <button
              type="button"
              className={`bg-error-color cursor-pointer p-3`}
              onClick={removeSelectedFile}
            >
              Delete file
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
      <button disabled={file === null} onClick={uploadFile}>
        צור פוסט
      </button>
      {status === StatusEnum.done && (
        <video>
          <source src={uploadedFile} type="video/mp4" />
        </video>
      )}
      {status === StatusEnum.loading && <Loading />}
      {status === StatusEnum.error && (
        <Error tryAgainCallback={uploadFile} error={"בעיה התרחשה, נסה שוב"} />
      )}
    </div>
  );
}
