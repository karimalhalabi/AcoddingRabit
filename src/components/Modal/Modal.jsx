import { useEffect, useRef } from "react";
import Icon from "../Icon/Icon.jsx";
import s from "./Modal.module.css";
export default function Modal({ title, onClose, children }) {
  const dialog = useRef(null);
  useEffect(() => {
    const element = dialog.current;
    const prior = document.activeElement;
    element.showModal();
    return () => {
      element.close();
      prior?.focus();
    };
  }, []);
  return (
    <dialog
      ref={dialog}
      className={s.dialog}
      onCancel={onClose}
      aria-labelledby="dialogTitle"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className={s.content}>
        <div className={s.header}>
          <h2 id="dialogTitle">{title}</h2>
          <button onClick={onClose} aria-label="Close">
            <Icon name="close" />
          </button>
        </div>
        {children}
      </div>
    </dialog>
  );
}
