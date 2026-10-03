import styles from "./Button.module.css";
export default function Button({
  children,
  secondary = false,
  className = "",
  ...props
}) {
  return (
    <button
      className={`${styles.button} ${secondary ? styles.secondary : ""} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
