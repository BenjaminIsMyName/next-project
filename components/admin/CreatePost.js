import styles from "./CreatePost.module.css";
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
      setStatus(StatusEnum.done);
      setUploadedFile(url.split("?")[0]);
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
    <div className={`${styles.container}`}>
      <h1>העלאת פוסט</h1>
      <input type={"text"} placeholder='כותרת' />
      <div className={styles.fileContainer}>
        {file === null ? (
          <label
            tabIndex='0'
            htmlFor='uploadInput'
            className={`${styles.actualSelectFileButton}`}
          >
            <span>בחר סרטון</span>
          </label>
        ) : (
          <div className={`${styles.fileExistContainer}`}>
            <h2>קובץ זה נבחר:</h2>
            <p>{file.name}</p>
            <button
              className={`${styles.removeFile}`}
              onClick={removeSelectedFile}
            >
              Delete file
            </button>
          </div>
        )}
        <input
          className={`${styles.uploadInput}`}
          id='uploadInput'
          type={"file"}
          onChange={handleFileSelect}
          accept='video/*'
        />
      </div>
      <button disabled={file === null} onClick={uploadFile}>
        צור פוסט
      </button>
      {status === StatusEnum.done && (
        <video>
          <source src={uploadedFile} type='video/mp4' />
        </video>
      )}
      {status === StatusEnum.loading && <Loading />}
      {status === StatusEnum.error && (
        <Error tryAgainCallback={uploadFile} error={"בעיה התרחשה, נסה שוב"} />
      )}
    </div>
  );
}
