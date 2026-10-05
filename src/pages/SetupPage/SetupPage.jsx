import { useState } from "react";
import toast from "react-hot-toast";
import { useApp } from "../../context/AppContext.jsx";
import {
  days,
  dayArabic,
  uid,
  makeGroups,
  generateSchedule,
  sampleTeachers,
  getRooms,
  validateInput,
} from "../../util/helpers.js";
import {
  parseTeachers,
  teacherWorkbook,
  saveWorkbook,
} from "../../util/excelHelpers.js";
import FileDrop from "../../components/FileDrop/FileDrop.jsx";
import Modal from "../../components/Modal/Modal.jsx";
import Icon from "../../components/Icon/Icon.jsx";
import p from "../page.module.css";
import s from "./SetupPage.module.css";
export default function SetupPage() {
  const { draft, setDraft, setSchedule, navigate, t, language } = useApp();
  const { settings, teachers, groups } = draft;
  const [step, setStep] = useState(0),
    [busy, setBusy] = useState(false),
    [error, setError] = useState(""),
    [editingGroup, setEditingGroup] = useState(null);
  const activeDays = settings.mode === "exams" ? [...days, "Thursday"] : days;
  const updateSettings = (key, value) =>
    setDraft((d) => ({ ...d, settings: { ...d.settings, [key]: value } }));
  const updateTeacher = (id, key, value) =>
    setDraft((d) => ({
      ...d,
      teachers: d.teachers.map((t) =>
        t.id === id ? { ...t, [key]: value } : t,
      ),
    }));
  const importFile = async (file) => {
    setBusy(true);
    setError("");
    try {
      const teachers = await parseTeachers(file);
      setDraft((d) => ({
        ...d,
        teachers,
        groups: makeGroups(d.settings, teachers),
      }));
      toast.success(
        t(
          `${teachers.length} teachers imported`,
          `تم استيراد ${teachers.length} معلماً`,
        ),
      );
    } catch (e) {
      setError(e.message);
    } finally {
      setBusy(false);
    }
  };
  const next = () => {
    setError("");
    if (step === 0) {
      try {
        validateInput(settings, teachers, makeGroups(settings, teachers));
      } catch (e) {
        setError(e.message);
        return;
      }
      if (
        groups.reduce((n, g) => n + g.students, 0) !== settings.studentCount ||
        groups.some((g) => g.students > settings.classCapacity)
      )
        setDraft((d) => ({ ...d, groups: makeGroups(settings, teachers) }));
    }
    if (step === 1) {
      try {
        validateInput(settings, teachers, makeGroups(settings, teachers));
      } catch (e) {
        setError(e.message);
        return;
      }
    }
    setStep(step + 1);
  };
  const generate = async () => {
    setBusy(true);
    setError("");
    await new Promise((resolve) => setTimeout(resolve, 60));
    try {
      const schedule = generateSchedule(settings, teachers, groups);
      setSchedule(schedule);
      toast.success(
        t(
          `${schedule.entries.length} sessions scheduled`,
          `تم توزيع ${schedule.entries.length} محاضرة`,
        ),
      );
      navigate("home");
    } catch (e) {
      setError(e.message);
    } finally {
      setBusy(false);
    }
  };
  return (
    <div className={p.page}>
      <div className={p.eyebrow}>
        <Icon name="grid" />
        <button className={p.subtleLink} onClick={() => navigate("home")}>
          {t("Workspace", "مساحة العمل")}
        </button>
        <Icon name="right" />
        {t("Create schedule", "إنشاء جدول")}
      </div>
      <div className={p.headingRow}>
        <div>
          <h1 className={p.pageTitle}>
            {t("A great semester starts here.", "فصل دراسي رائع يبدأ هنا.")}
          </h1>
          <p className={p.description}>
            {t(
              "Your people. Your spaces. A schedule that brings it all together.",
              "معلموك وقاعاتك. جدول يجمع كل شيء.",
            )}
          </p>
        </div>
        <span className={p.tag}>
          <Icon name="save" />
          {t("Draft kept between pages", "تُحفظ المسودة بين الصفحات")}
        </span>
      </div>
      <div className={s.steps}>
        {[
          ["Campus & spaces", "الجامعة والقاعات"],
          ["Teachers & availability", "المعلمون والتوافر"],
          ["Groups & teaching load", "المجموعات والعبء الدراسي"],
        ].map(([en, ar], i) => (
          <button
            key={en}
            className={
              step === i ? s.currentStep : step > i ? s.completeStep : ""
            }
            onClick={() => {
              if (i < step) {
                setStep(i);
                setError("");
              }
            }}
            disabled={i > step}
          >
            <span>
              {step > i ? (
                <Icon name="check" />
              ) : (
                String(i + 1).padStart(2, "0")
              )}
            </span>
            <div>
              <small>
                {t("STEP", "الخطوة")} {i + 1}
              </small>
              {t(en, ar)}
            </div>
            {i < 2 && <Icon name="right" />}
          </button>
        ))}
      </div>
      {step === 0 && (
        <>
          <section className={p.panel}>
            <h2 className={p.panelTitle}>
              <Icon name="calendar" />
              {t("Start with the essentials", "ابدأ بالأساسيات")}
            </h2>
            <p className={p.panelCaption}>
              {t(
                "Set up a regular teaching week or an exam timetable that can span several weeks.",
                "أنشئ أسبوعاً دراسياً أو جدول امتحانات يمتد لعدة أسابيع.",
              )}
            </p>
            <div className={p.fieldGrid}>
              <label>
                {t("Schedule title", "عنوان الجدول")}
                <input
                  maxLength={100}
                  value={settings.term}
                  onChange={(e) => updateSettings("term", e.target.value)}
                />
              </label>
              <label>
                {t("Schedule type", "نوع الجدول")}
                <select
                  value={settings.mode}
                  onChange={(e) => updateSettings("mode", e.target.value)}
                >
                  <option value="classes">
                    {t(
                      "Weekly classes · Saturday–Wednesday",
                      "محاضرات أسبوعية · السبت–الأربعاء",
                    )}
                  </option>
                  <option value="exams">
                    {t(
                      "Examinations · Saturday–Thursday",
                      "امتحانات · السبت–الخميس",
                    )}
                  </option>
                </select>
              </label>
              <label>
                {t("Total students", "إجمالي الطلاب")}
                <input
                  type="number"
                  min={1}
                  max={10000}
                  value={settings.studentCount}
                  onChange={(e) =>
                    updateSettings("studentCount", Number(e.target.value))
                  }
                />
              </label>
              {settings.mode === "exams" && (
                <label>
                  {t("Number of exam weeks", "عدد أسابيع الامتحانات")}
                  <input
                    type="number"
                    min={1}
                    max={8}
                    value={settings.weeks}
                    onChange={(e) =>
                      updateSettings("weeks", Number(e.target.value))
                    }
                  />
                </label>
              )}
            </div>
          </section>
          <section className={p.panel}>
            <h2 className={p.panelTitle}>
              <Icon name="grid" />
              {t("Make room for learning", "افسح المجال للتعلم")}
            </h2>
            <p className={p.panelCaption}>
              {t(
                "Classrooms and laboratories are numbered separately. Lab sessions split groups into smaller sections automatically.",
                "ترقّم القاعات والمختبرات بشكل منفصل. تُقسّم المجموعات في المختبر تلقائياً.",
              )}
            </p>
            <div className={p.fieldGrid}>
              {[
                ["classroomCount", "Classrooms", "عدد القاعات", 1, 50],
                [
                  "classCapacity",
                  "Students per classroom",
                  "طلاب في القاعة",
                  1,
                  200,
                ],
                ["labCount", "Laboratories", "عدد المختبرات", 0, 30],
                [
                  "labCapacity",
                  "Students per laboratory",
                  "طلاب في المختبر",
                  1,
                  100,
                ],
              ].map(([key, en, ar, min, max]) => (
                <label key={key}>
                  {t(en, ar)}
                  <input
                    type="number"
                    min={min}
                    max={max}
                    value={settings[key]}
                    onChange={(e) =>
                      updateSettings(key, Number(e.target.value))
                    }
                  />
                </label>
              ))}
            </div>
            <div className={p.notice}>
              <Icon name="clock" />
              <span>
                {t(
                  "Three two-hour periods each day: 9–11 am, 11 am–1 pm, and 1–3 pm. Classes repeat weekly; examinations are scheduled once across the chosen weeks.",
                  "ثلاث فترات يومية: ٩–١١، ١١–١، و١–٣. تتكرر المحاضرات أسبوعياً وتُجدول الامتحانات مرة واحدة خلال الأسابيع المحددة.",
                )}
              </span>
            </div>
          </section>
        </>
      )}
      {step === 1 && (
        <>
          <section className={p.panel}>
            <div className={p.sectionTitle}>
              <div>
                <h2 className={p.panelTitle}>
                  <Icon name="upload" />
                  {t("Bring your faculty on board", "أضف هيئة التدريس")}
                </h2>
                <p className={p.muted}>
                  {t(
                    "Upload an Excel file or edit the sample teachers below.",
                    "ارفع ملف إكسل أو عدّل بيانات المعلمين أدناه.",
                  )}
                </p>
              </div>
              <button
                className={p.button}
                onClick={async () => {
                  try {
                    await saveWorkbook(
                      await teacherWorkbook(sampleTeachers()),
                      "Tarteeb-teachers-sample.xlsx",
                    );
                  } catch (e) {
                    toast.error(e.message);
                  }
                }}
              >
                <Icon name="download" />
                {t("Sample workbook", "ملف نموذجي")}
              </button>
            </div>
            <FileDrop onFile={importFile} busy={busy} />
            <div className={p.notice}>
              <Icon name="info" />
              {t(
                "8 columns: Teacher Name, Subject, Fulltime, Saturday, Sunday, Monday, Tuesday, Wednesday. Use Yes or No. Uploading replaces the current teacher list and group subject assignments.",
                "٨ أعمدة: اسم المعلم، المادة، دوام كامل، والأيام من السبت إلى الأربعاء (بعناوين إنجليزية كما في النموذج). استخدم Yes أو No. الاستيراد يستبدل المعلمين وتوزيع المواد.",
              )}
            </div>
          </section>
          <section className={p.panel}>
            <div className={p.sectionTitle}>
              <h2 className={p.panelTitle}>
                {t("Teacher availability", "توافر المعلمين")}
                <span className={p.tag}>{teachers.length}</span>
              </h2>
              <button
                className={p.button}
                onClick={() =>
                  setDraft((d) => ({
                    ...d,
                    teachers: [
                      ...d.teachers,
                      {
                        id: uid(),
                        name: "",
                        subject: "",
                        fulltime: true,
                        days: [...days],
                        kind: "classroom",
                        sessions: 1,
                      },
                    ],
                  }))
                }
              >
                <Icon name="plus" />
                {t("Add teacher", "إضافة معلم")}
              </button>
            </div>
            <div className={p.tableWrapper}>
              <table className={p.dataTable}>
                <thead>
                  <tr>
                    <th>{t("Teacher", "المعلم")}</th>
                    <th>{t("Subject", "المادة")}</th>
                    <th>{t("Full time", "دوام كامل")}</th>
                    {activeDays.map((d) => (
                      <th key={d}>
                        {language === "ar" ? dayArabic[d] : d.slice(0, 3)}
                      </th>
                    ))}
                    <th>{t("Space", "المكان")}</th>
                    <th>{t("Sessions/week", "محاضرات/أسبوع")}</th>
                    <th />
                  </tr>
                </thead>
                <tbody>
                  {teachers.map((teacher) => (
                    <tr key={teacher.id}>
                      <td>
                        <input
                          aria-label={t("Teacher name", "اسم المعلم")}
                          maxLength={100}
                          value={teacher.name}
                          onChange={(e) =>
                            updateTeacher(teacher.id, "name", e.target.value)
                          }
                        />
                      </td>
                      <td>
                        <input
                          aria-label={t("Subject name", "اسم المادة")}
                          maxLength={100}
                          value={teacher.subject}
                          onChange={(e) =>
                            updateTeacher(teacher.id, "subject", e.target.value)
                          }
                        />
                      </td>
                      <td>
                        <input
                          type="checkbox"
                          aria-label={`${teacher.name} ${t("full time", "دوام كامل")}`}
                          checked={teacher.fulltime}
                          onChange={(e) =>
                            updateTeacher(
                              teacher.id,
                              "fulltime",
                              e.target.checked,
                            )
                          }
                        />
                      </td>
                      {activeDays.map((d) => (
                        <td key={d}>
                          <input
                            type="checkbox"
                            checked={teacher.days.includes(d)}
                            aria-label={`${teacher.name} ${d}`}
                            onChange={(e) =>
                              updateTeacher(
                                teacher.id,
                                "days",
                                e.target.checked
                                  ? [...teacher.days, d]
                                  : teacher.days.filter((day) => day !== d),
                              )
                            }
                          />
                        </td>
                      ))}
                      <td>
                        <select
                          aria-label={`${teacher.name} ${t("room type", "نوع القاعة")}`}
                          value={teacher.kind}
                          onChange={(e) =>
                            updateTeacher(teacher.id, "kind", e.target.value)
                          }
                        >
                          <option value="classroom">
                            {t("Classroom", "قاعة")}
                          </option>
                          <option value="lab">
                            {t("Laboratory", "مختبر")}
                          </option>
                        </select>
                      </td>
                      <td>
                        <input
                          type="number"
                          min={1}
                          max={6}
                          disabled={settings.mode === "exams"}
                          aria-label={`${teacher.name} ${t("sessions per week", "محاضرات أسبوعياً")}`}
                          value={teacher.sessions}
                          onChange={(e) =>
                            updateTeacher(
                              teacher.id,
                              "sessions",
                              Number(e.target.value),
                            )
                          }
                        />
                      </td>
                      <td>
                        <button
                          aria-label={`${t("Remove", "إزالة")} ${teacher.name}`}
                          onClick={() =>
                            setDraft((d) => ({
                              ...d,
                              teachers: d.teachers.filter(
                                (t) => t.id !== teacher.id,
                              ),
                              groups: d.groups.map((g) => ({
                                ...g,
                                subjects: g.subjects.filter(
                                  (id) => id !== teacher.id,
                                ),
                              })),
                            }))
                          }
                        >
                          <Icon name="trash" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p
              className={p.panelCaption}
              style={{ marginTop: 15, marginBottom: 0 }}
            >
              {t(
                "Availability checkboxes are authoritative, including for full-time and special-circumstance teachers. Tick Thursday explicitly for exams.",
                "مربعات توافر الأيام هي المعتمدة، حتى للدوام الكامل والظروف الخاصة. حدد الخميس صراحة للامتحانات.",
              )}
            </p>
          </section>
        </>
      )}
      {step === 2 && (
        <>
          <div className={s.summaryStrip}>
            <span>
              <Icon name="users" />
              <strong>{settings.studentCount}</strong>
              {t("students", "طالب")}
            </span>
            <span>
              <Icon name="book" />
              <strong>{teachers.length}</strong>
              {t("subjects", "مادة")}
            </span>
            <span>
              <Icon name="grid" />
              <strong>{getRooms(settings).length}</strong>
              {t("spaces", "مساحة")}
            </span>
            <span>
              <Icon name="layers" />
              <strong>{groups.length}</strong>
              {t("groups", "مجموعة")}
            </span>
          </div>
          <section className={p.panel}>
            <div className={p.sectionTitle}>
              <div>
                <h2 className={p.panelTitle}>
                  {t("What does each group study?", "ماذا تدرس كل مجموعة؟")}
                </h2>
                <p className={p.muted}>
                  {t(
                    "Select the actual curriculum for each student group.",
                    "اختر المواد الفعلية لكل مجموعة طلابية.",
                  )}
                </p>
              </div>
              <button
                className={p.button}
                onClick={() =>
                  setDraft((d) => ({
                    ...d,
                    groups: d.groups.map((g) => ({
                      ...g,
                      subjects: teachers.map((t) => t.id),
                    })),
                  }))
                }
              >
                {t(
                  "Assign all subjects to all groups",
                  "إسناد كل المواد لكل المجموعات",
                )}
              </button>
            </div>
            <div className={p.notice}>
              <Icon name="info" />
              {t(
                "The sample assigns two subjects per group as a starting point. Review these assignments. Teaching every subject to every group can exceed room or teacher availability; any unplaced sessions will be listed.",
                "يبدأ النموذج بمادتين لكل مجموعة. راجع التوزيع. قد يتجاوز تدريس جميع المواد لكل مجموعة سعة القاعات أو توافر المعلمين؛ ستظهر المحاضرات غير الموزعة.",
              )}
            </div>
            <div className={s.groupGrid}>
              {groups.map((g) => (
                <button
                  className={s.groupCard}
                  key={g.id}
                  onClick={() => setEditingGroup(g.id)}
                >
                  <span>
                    <strong>{g.name}</strong>
                    <small>
                      {g.students} {t("students", "طالب")}
                    </small>
                    <Icon name="edit" />
                  </span>
                  <p>
                    {g.subjects.length
                      ? g.subjects
                          .map(
                            (id) => teachers.find((t) => t.id === id)?.subject,
                          )
                          .join(" · ")
                      : t(
                          "Select at least one subject",
                          "اختر مادة واحدة على الأقل",
                        )}
                  </p>
                  <em>
                    {g.subjects.length} {t("subjects", "مادة")}
                  </em>
                </button>
              ))}
            </div>
          </section>
        </>
      )}
      {error && (
        <div role="alert" className={p.error}>
          {error}
        </div>
      )}
      <div className={p.bottomActions}>
        <button
          className={p.button}
          onClick={() => {
            setError("");
            step ? setStep(step - 1) : navigate("home");
          }}
        >
          <Icon name="back" />
          {step
            ? t("Back", "السابق")
            : t("Back to overview", "العودة للرئيسية")}
        </button>
        {step < 2 ? (
          <button className={p.primaryButton} disabled={busy} onClick={next}>
            {t("Continue", "متابعة")}
            <Icon name="arrow" />
          </button>
        ) : (
          <button className={p.goldButton} disabled={busy} onClick={generate}>
            <Icon name="calendar" />
            {busy
              ? t("Finding the right places…", "جاري توزيع المحاضرات…")
              : t("Confirm & generate schedule", "تأكيد وإنشاء الجدول")}
            <Icon name="arrow" />
          </button>
        )}
      </div>
      {editingGroup && (
        <Modal
          title={groups.find((g) => g.id === editingGroup)?.name}
          onClose={() => setEditingGroup(null)}
        >
          <p className={p.panelCaption}>
            {t(
              "Choose the subjects this group attends.",
              "اختر المواد التي تحضرها المجموعة.",
            )}
          </p>
          <div className={s.subjectChoices}>
            {teachers.map((teacher) => (
              <label key={teacher.id}>
                <input
                  type="checkbox"
                  checked={
                    groups
                      .find((g) => g.id === editingGroup)
                      ?.subjects.includes(teacher.id) || false
                  }
                  onChange={(e) =>
                    setDraft((d) => ({
                      ...d,
                      groups: d.groups.map((g) =>
                        g.id === editingGroup
                          ? {
                              ...g,
                              subjects: e.target.checked
                                ? [...g.subjects, teacher.id]
                                : g.subjects.filter((id) => id !== teacher.id),
                            }
                          : g,
                      ),
                    }))
                  }
                />
                <span>
                  {teacher.subject}
                  <small>
                    {teacher.name} · {teacher.sessions}{" "}
                    {t("sessions/week", "محاضرة/أسبوع")}
                  </small>
                </span>
              </label>
            ))}
          </div>
          <button
            className={p.primaryButton}
            style={{ marginTop: 20, width: "100%" }}
            onClick={() => setEditingGroup(null)}
          >
            <Icon name="check" />
            {t("Done", "تم")}
          </button>
        </Modal>
      )}
    </div>
  );
}
