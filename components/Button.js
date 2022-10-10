import styles from "./Button.module.css";

export default function Button(props) {
  const { children } = props;
  let copyOfProps = { ...props };
  delete copyOfProps.children;
  delete copyOfProps.className;
  return (
    <button
      className={`${styles.btn} ${props.className || ""}`}
      {...copyOfProps}
    >
      <span>{children}</span>
    </button>
  );
}
