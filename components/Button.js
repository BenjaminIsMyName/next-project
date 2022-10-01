import styles from "./Button.module.css";

export default function Button(props) {
  const { children } = props;
  let copyOfProps = { ...props };
  delete copyOfProps.children;
  return (
    <button className={styles.btn} {...copyOfProps}>
      <span>{children}</span>
    </button>
  );
}
