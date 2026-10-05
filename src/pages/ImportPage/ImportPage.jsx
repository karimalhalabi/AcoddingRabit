import { useState } from "react";
import toast from "react-hot-toast";
import { useApp } from "../../context/AppContext.jsx";
import { importSchedule } from "../../util/excelHelpers.js";
import FileDrop from "../../components/FileDrop/FileDrop.jsx";
import Icon from "../../components/Icon/Icon.jsx";
import p from "../page.module.css";
import s from "./ImportPage.module.css";
export default function ImportPage() {
  const { setSchedule, t, navigate } = useApp(),
    [busy, setBusy] = useState(false),
    [error, setError] = useState(""),
    [imported, setImported] = useState(null);
  async function load(file) {
    setBusy(true);
    setError("");
    setImported(null);
    try {
      setImported(await importSchedule(file));
    } catch (e) {
      setError(e.message);
    } finally {
      setBusy(false);
    }
  }
  return (
    <div className={p.page}>
      <div className={p.eyebrow}>
        <Icon name="grid" />
        {t("Workspace", "مساحة العمل")}
        <Icon name="right" />
        {t("Edit a schedule", "تعديل جدول")}
      </div>
      <div className={p.headingRow}>
        <div>
          <h1 className={p.pageTitle}>
            {t("Good plans evolve.", "الخطط الجيدة تتطور.")}
          </h1>
          <p className={p.description}>
            {t(
              "Bring back a previous timetable and make it work for what’s next.",
              "استعد جدولاً سابقاً وعدّله ليلائم خططك القادمة.",
            )}
          </p>
        </div>
      </div>
      <div className={s.importLayout}>
        <section className={p.panel}>
          <h2 className={p.panelTitle}>
            {t("Pick up where you left off", "تابع من حيث توقفت")}
          </h2>
          <p className={p.panelCaption}>
            {t(
              "Upload an Excel schedule previously exported from Tarteeb.",
              "ارفع جدول إكسل سبق تصديره من ترتيب.",
            )}
          </p>
          <FileDrop
            busy={busy}
            onFile={load}
            label={t("Drop your schedule here", "اسحب جدولك هنا")}
          />
          {error && (
            <div className={p.error} role="alert">
              {error}
            </div>
          )}
          {imported && (
            <div className={s.importResult}>
              <Icon name="checkCircle" />
              <h3>{imported.name}</h3>
              <p>
                {imported.entries.length} {t("sessions", "محاضرة")} ·{" "}
                {imported.teachers.length} {t("teachers", "معلم")} ·{" "}
                {imported.unplaced.length} {t("unplaced", "غير موزعة")}
              </p>
              <button
                className={p.primaryButton}
                onClick={() => {
                  setSchedule(imported);
                  navigate("home");
                  toast.success(
                    t(
                      "Schedule imported and ready to edit",
                      "تم استيراد الجدول وأصبح جاهزاً للتعديل",
                    ),
                  );
                }}
              >
                {t("Open & edit schedule", "فتح وتعديل الجدول")}
                <Icon name="arrow" />
              </button>
              <small>
                {t(
                  "Opening replaces the current timetable. Export your current timetable first if you want to keep it.",
                  "فتح الملف يستبدل الجدول الحالي. صدّر الجدول الحالي أولاً إذا أردت الاحتفاظ به.",
                )}
              </small>
            </div>
          )}
        </section>
        <aside className={s.instructions}>
          <span className={s.instructionIcon}>
            <Icon name="file" />
          </span>
          <h2>
            {t("From Excel to a fresh start.", "من إكسل إلى بداية جديدة.")}
          </h2>
          {[
            [
              "01",
              "Export it",
              "صدّر الجدول",
              "Use Export Excel on your timetable to create a formatted workbook.",
              "استخدم تصدير إكسل لإنشاء ملف منسق.",
            ],
            [
              "02",
              "Make it yours",
              "عدّله كما تريد",
              "Edit roomId, day, period (0–2), and week in the Sessions sheet. Keep all IDs and other data intact.",
              "عدّل roomId وday وperiod (٠–٢) وweek في ورقة Sessions. احتفظ بالمعرفات والبيانات الأخرى.",
            ],
            [
              "03",
              "Bring it back",
              "أعد استيراده",
              "Upload it here. We’ll check availability, capacity, completeness, and conflicts before you open it.",
              "ارفعه هنا. نتحقق من التوافر والسعة واكتمال البيانات والتعارضات قبل فتحه.",
            ],
          ].map(([n, en, ar, desc, arabic]) => (
            <div className={s.instructionStep} key={n}>
              <span>{n}</span>
              <div>
                <h3>{t(en, ar)}</h3>
                <p>{t(desc, arabic)}</p>
              </div>
            </div>
          ))}
        </aside>
      </div>
    </div>
  );
}
