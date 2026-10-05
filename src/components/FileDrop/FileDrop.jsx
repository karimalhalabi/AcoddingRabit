import { useRef, useState } from "react";
import Icon from "../Icon/Icon.jsx";
import { useApp } from "../../context/AppContext.jsx";
import s from "./FileDrop.module.css";
export default function FileDrop({ onFile, busy, label }) {
  const { t } = useApp(),
    input = useRef(null);
  const [drag, setDrag] = useState(false);
  return (
    <div
      className={`${s.dropZone} ${drag ? s.dragging : ""}`}
      onDragOver={(e) => {
        e.preventDefault();
        setDrag(true);
      }}
      onDragLeave={() => setDrag(false)}
      onDrop={(e) => {
        e.preventDefault();
        setDrag(false);
        if (!busy && e.dataTransfer.files[0]) onFile(e.dataTransfer.files[0]);
      }}
    >
      <span className={s.fileIcon}>
        <Icon name="upload" />
      </span>
      <h3>
        {busy
          ? t("Reading your workbook…", "جاري قراءة الملف…")
          : label ||
            t("Drop your teacher workbook here", "اسحب ملف المعلمين هنا")}
      </h3>
      <p>
        {t("or", "أو")}{" "}
        <button disabled={busy} onClick={() => input.current.click()}>
          {t("browse files", "تصفح الملفات")}
        </button>{" "}
        {t("from your computer", "من جهازك")}
      </p>
      <small>XLSX · {t("Up to 5 MB", "حتى ٥ ميجابايت")}</small>
      <input
        aria-label={t("Upload Excel workbook", "رفع ملف إكسل")}
        type="file"
        accept=".xlsx"
        ref={input}
        onChange={(e) => {
          if (e.target.files[0]) onFile(e.target.files[0]);
          e.target.value = "";
        }}
        hidden
      />
    </div>
  );
}
