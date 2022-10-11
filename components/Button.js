import styles from "./Button.module.css";

export default function Button(props) {
  const { children } = props;
  let copyOfProps = { ...props };
  delete copyOfProps.children;
  delete copyOfProps.className;
  return (
    <button
      onMouseDown={e => e.preventDefault()} // solves bug when clicking a button and losing focus from input with error, see: https://stackoverflow.com/a/57630197/19460851
      className={`${styles.btn} ${props.className || ""}`}
      {...copyOfProps}
    >
      <span>{children}</span>
    </button>
  );
}
