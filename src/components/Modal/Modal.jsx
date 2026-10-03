import { useRef, useCallback } from "react";
import { FiX } from "react-icons/fi";
import { useDialog } from "../../util/help";
import styles from "./Modal.module.css";
export default function Modal({
  children,
  title,
  onClose,
  wide = false,
  closeLabel = "Close",
}) {
  const ref = useRef(null);
  const close = useCallback(onClose, [onClose]);
  useDialog(ref, close);
  return (
    <div
      className={styles.backdrop}
      onClick={(e) => {
        if (e.target === e.currentTarget) close();
      }}
    >
      <section
        ref={ref}
        tabIndex={-1}
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className={`${styles.modal} ${wide ? styles.wide : ""}`}
      >
        <div className={styles.modalHeader}>
          <span>{title}</span>
          <button onClick={close} aria-label={closeLabel}>
            <FiX />
          </button>
        </div>
        <div className={styles.modalBody}>{children}</div>
      </section>
    </div>
  );
}
