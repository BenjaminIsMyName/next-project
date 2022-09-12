import styles from "./CreatePost.module.css";
import { useState } from "react";
import Error from "../Error";
import axios from "axios";
import Loading from "../Loading";
export default function CreatePost() {
  const [file, setFile] = useState(null);
  const [status, setStatus] = useState(0); // 0 - nothing. 1 - loading. 2 - error. 3 - done.
  const [uploadedFile, setUploadedFile] = useState(null);
  function handleFileSelect(e) {
    setFile(e.target.files[0]);
  }

  async function uploadFile() {
    setStatus(1);
    try {
      let { data } = await axios.put("/api/upload", {
        name: file.name,
        type: file.type,
      });

      const url = data.url;
      console.log(url);
      await axios.put(url, file, {
        headers: {
          "Content-type": file.type,
          "Access-Control-Allow-Origin": "*",
        },
      });

      setFile(null);
      setStatus(3);
      setUploadedFile(url.split("?")[0]);
    } catch (error) {
      console.log(`error is`, error);

      setStatus(2);
    }
  }
  return (
    <div className={`${styles.container}`}>
      <h1>העלאת פוסט</h1>
      <input type={"text"} placeholder='כותרת' />
      <div className={styles.fileContainer}>
        {file === null ? (
          <label
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
              onClick={
                () =>
                  setFile(null) ||
                  (document.querySelector("#uploadInput").value = "") // we need this in case the user select a file > delete it > select the same file again. This way, the "onChange" will be triggered.
              }
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
      {status === 3 && (
        <video>
          <source src={uploadedFile} type='video/mp4' />
        </video>
      )}
      {status === 1 && <Loading />}
      {status === 2 && (
        <Error tryAgainCallback={uploadFile} error={"בעיה התרחשה, נסה שוב"} />
      )}
    </div>
  );
}
