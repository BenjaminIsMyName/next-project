import styles from "./Error.module.css";

export default function Error({ tryAgainCallback, error }) {
  return (
    <div className={styles.errorContainer}>
      <h1>{error.toString()}</h1>
      {tryAgainCallback && <button onClick={tryAgainCallback}>נסה שוב</button>}
    </div>
  );
}
