import { useState } from "react";
import toast from "react-hot-toast";
import { useApp } from "../../context/AppContext.jsx";
import {
  getRooms,
  getDays,
  roomLabel,
  formatDate,
} from "../../util/helpers.js";
import { exportSchedule, saveWorkbook } from "../../util/excelHelpers.js";
import Icon from "../../components/Icon/Icon.jsx";
import StatCard from "../../components/StatCard/StatCard.jsx";
import Timetable from "../../components/Timetable/Timetable.jsx";
import Modal from "../../components/Modal/Modal.jsx";
import p from "../page.module.css";
import s from "./HomePage.module.css";
export default function HomePage() {
  const { schedule, setSchedule, navigate, t, language, save, saved, user } =
    useApp();
  const [roomId, setRoomId] = useState("C1"),
    [kind, setKind] = useState("classroom"),
    [week, setWeek] = useState(1),
    [search, setSearch] = useState(""),
    [exporting, setExporting] = useState(false),
    [showUnplaced, setShowUnplaced] = useState(false),
    [showSaved, setShowSaved] = useState(false);
  const rooms = getRooms(schedule.settings),
    room = rooms.find((r) => r.id === roomId) || rooms[0];
  const weeks =
    schedule.settings.mode === "exams" ? schedule.settings.weeks : 1;
  const activeWeek = Math.min(week, weeks);
  const roomEntries = schedule.entries.filter(
    (e) => e.roomId === room.id && e.week === activeWeek,
  );
  const slots = getDays(schedule.settings).length * 3;
  const exportFile = async () => {
    setExporting(true);
    try {
      await saveWorkbook(
        await exportSchedule(schedule, language),
        "Tarteeb-schedule.xlsx",
      );
      toast.success(t("Your Excel schedule is ready", "جدول إكسل جاهز"));
    } catch (e) {
      toast.error(e.message);
    } finally {
      setExporting(false);
    }
  };
  return (
    <div className={p.page}>
      <div className={p.eyebrow}>
        <Icon name="grid" />
        <span>{t("Workspace", "مساحة العمل")}</span>
        <Icon name="right" />
        {t("Overview", "نظرة عامة")}
      </div>
      <div className={p.headingRow}>
        <div>
          <h1 className={p.pageTitle}>
            {t(
              "Good plans. Great possibilities.",
              "خطط مدروسة. إمكانيات كبيرة.",
            )}
          </h1>
          <p className={p.description}>
            {t(
              "A little less coordinating. A lot more time for what matters.",
              "تنسيق أقل، ووقت أكثر لما يهمّ حقاً.",
            )}
          </p>
        </div>
        <div className={p.actions}>
          <button className={p.button} onClick={() => setShowSaved(true)}>
            <Icon name="layers" />
            {t("Saved schedules", "الجداول المحفوظة")}
          </button>
          <button className={p.primaryButton} onClick={() => navigate("setup")}>
            <Icon name="plus" />
            {t("Create a schedule", "إنشاء جدول")}
          </button>
        </div>
      </div>
      <section className={s.welcomeBanner}>
        <div className={s.bannerContent}>
          <span className={s.bannerEyebrow}>
            <i />
            {t("LESS ADMIN. MORE ACADEMIA.", "إدارة أقل. تعليم أكثر.")}
          </span>
          <h2>
            {t("Every class.", "كل محاضرة.")}
            <br />
            {t("In its right place.", "في مكانها الصحيح.")}
          </h2>
          <p>
            {t(
              "Bring your teachers, spaces, and students together.",
              "اجمع المعلمين والقاعات والطلاب في مكان واحد.",
            )}
            <br />
            {t(
              "We’ll help you make room for a better semester.",
              "لنفسح المجال لفصل دراسي أفضل.",
            )}
          </p>
          <button onClick={() => navigate("setup")}>
            {t("Let’s get organized", "لنبدأ التنظيم")}
            <Icon name="arrow" />
          </button>
        </div>
        <div className={s.bannerIllustration} aria-hidden="true">
          <span className={s.orbitOne} />
          <span className={s.orbitTwo} />
          <span className={s.sparkOne}>✦</span>
          <span className={s.sparkTwo}>✧</span>
          <div className={s.miniCalendar}>
            <div className={s.miniHead}>
              <span />
              <span />
              <b>YOUR WEEK, IN HARMONY</b>
              <Icon name="calendar" />
            </div>
            <div className={s.miniDays}>
              <span>SAT</span>
              <span>SUN</span>
              <span>MON</span>
              <span>TUE</span>
              <span>WED</span>
            </div>
            <div className={s.miniGrid}>
              {Array.from({ length: 15 }, (_, i) => (
                <span className={s[`block${i % 6}`]} key={i}>
                  {![2, 6, 9, 13].includes(i) && (
                    <>
                      <i />
                      <em />
                    </>
                  )}
                </span>
              ))}
            </div>
          </div>
          <div className={s.floatBadge}>
            <span>
              <Icon name="check" />
            </span>
            <div>
              {t("Perfectly in sync", "تناغم تام")}
              <small>{t("A place for every class", "مكان لكل محاضرة")}</small>
            </div>
          </div>
          <div className={s.littleBadge}>
            <Icon name="users" />
            <span>{t("Made for your campus", "صُمم لجامعتك")}</span>
          </div>
        </div>
      </section>
      <div className={s.statsGrid}>
        <StatCard
          icon="users"
          label={t("Total students", "عدد الطلاب")}
          value={schedule.settings.studentCount.toLocaleString(language)}
          detail={`${schedule.groups.length} ${t("student groups, ready to learn", "مجموعة طلابية جاهزة للتعلم")}`}
          note={t("this semester", "هذا الفصل")}
        />
        <StatCard
          icon="book"
          tone="purple"
          label={t("Teaching faculty", "هيئة التدريس")}
          value={String(schedule.teachers.length).padStart(2, "0")}
          detail={`${schedule.teachers.filter((t) => t.fulltime).length} ${t("full-time", "دوام كامل")} · ${schedule.teachers.filter((t) => !t.fulltime).length} ${t("part-time", "دوام جزئي")}`}
        />
        <StatCard
          icon="grid"
          tone="orange"
          label={t("Learning spaces", "مساحات التعلم")}
          value={String(rooms.length).padStart(2, "0")}
          detail={`${schedule.settings.classroomCount} ${t("classrooms", "قاعة")} · ${schedule.settings.labCount} ${t("laboratories", "مختبرات")}`}
        />
        <StatCard
          icon="calendar"
          tone="green"
          label={t("Classes scheduled", "المحاضرات الموزعة")}
          value={schedule.entries.length}
          detail={
            schedule.unplaced.length
              ? `${schedule.unplaced.length} ${t("sessions need your attention", "محاضرة تحتاج انتباهك")}`
              : t(
                  "All sessions placed without conflicts",
                  "جميع المحاضرات موزعة دون تعارض",
                )
          }
          note={t("sessions", "محاضرة")}
        />
      </div>
      <section className={s.scheduleSection}>
        <div className={s.scheduleHeading}>
          <div>
            <div className={s.titleWithTag}>
              <h2>{t("Your weekly schedule", "جدولك الأسبوعي")}</h2>
              <span className={s.liveBadge}>
                <i />
                {schedule.isSample
                  ? t("Sample timetable", "جدول نموذجي")
                  : t("Live timetable", "جدول تفاعلي")}
              </span>
            </div>
            <p>
              {t(
                "The right teacher, in the right room, at the right time.",
                "المعلم المناسب، في القاعة المناسبة، في الوقت المناسب.",
              )}
            </p>
          </div>
          <div className={p.actions}>
            <span className={s.termBadge}>
              <Icon name="calendar" />
              {schedule.settings.term}
            </span>
            <button
              className={p.button}
              disabled={exporting}
              onClick={exportFile}
            >
              <Icon name="download" />
              {exporting
                ? t("Exporting…", "جاري التصدير…")
                : t("Export Excel", "تصدير إكسل")}
            </button>
          </div>
        </div>
        <div className={s.scheduleWorkspace}>
          <aside className={s.roomSidebar}>
            <div className={s.roomTabs}>
              <button
                className={kind === "classroom" ? s.selectedTab : ""}
                onClick={() => {
                  setKind("classroom");
                  setRoomId("C1");
                  setSearch("");
                }}
              >
                {t("Classrooms", "القاعات")}
                <span>{schedule.settings.classroomCount}</span>
              </button>
              <button
                className={kind === "lab" ? s.selectedTab : ""}
                onClick={() => {
                  setKind("lab");
                  if (schedule.settings.labCount) setRoomId("L1");
                  setSearch("");
                }}
              >
                {t("Labs", "المختبرات")}
                <span>{schedule.settings.labCount}</span>
              </button>
            </div>
            <label className={s.roomSearch}>
              <Icon name="search" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder={t("Find a room…", "ابحث عن قاعة…")}
                aria-label={t("Find a room", "ابحث عن قاعة")}
              />
            </label>
            <div className={s.roomList}>
              {rooms
                .filter(
                  (r) =>
                    r.kind === kind &&
                    roomLabel(r, language)
                      .toLowerCase()
                      .includes(search.toLowerCase()),
                )
                .map((r) => (
                  <button
                    key={r.id}
                    className={`${s.roomButton} ${r.id === room.id ? s.selectedRoom : ""}`}
                    onClick={() => setRoomId(r.id)}
                  >
                    <span className={s.roomIcon}>
                      <Icon name={r.kind === "lab" ? "layers" : "grid"} />
                    </span>
                    <span>
                      {roomLabel(r, language)}
                      <small>
                        {r.capacity} {t("seats available", "مقعد")}
                      </small>
                    </span>
                    <Icon name="right" />
                  </button>
                ))}
            </div>
            <div className={s.sidebarNote}>
              <Icon name="info" />
              <p>
                {t(
                  "A space for every kind of learning. Select a room to see its week.",
                  "مساحة لكل أنواع التعلم. اختر قاعة لعرض جدولها.",
                )}
              </p>
            </div>
          </aside>
          <div className={s.timetablePanel}>
            <div className={s.roomHeader}>
              <div className={s.roomTitle}>
                <span className={s.roomTitleIcon}>
                  <Icon name={room.kind === "lab" ? "layers" : "grid"} />
                </span>
                <div>
                  <h3>{roomLabel(room, language)}</h3>
                  <p>
                    <span>
                      <Icon name="users" />
                      {room.capacity} {t("students", "طالب")}
                    </span>
                    <i />
                    <span>
                      {roomEntries.length}{" "}
                      {t("classes this week", "محاضرة هذا الأسبوع")}
                    </span>
                  </p>
                </div>
              </div>
              <div className={s.weekControl}>
                <button
                  aria-label={t("Previous week", "الأسبوع السابق")}
                  disabled={activeWeek <= 1}
                  onClick={() => setWeek(activeWeek - 1)}
                >
                  <Icon name="left" />
                </button>
                <span>
                  {t("Week", "الأسبوع")} {String(activeWeek).padStart(2, "0")}
                </span>
                <button
                  aria-label={t("Next week", "الأسبوع التالي")}
                  disabled={activeWeek >= weeks}
                  onClick={() => setWeek(activeWeek + 1)}
                >
                  <Icon name="right" />
                </button>
              </div>
            </div>
            <Timetable roomId={room.id} week={activeWeek} />
          </div>
        </div>
        <div className={s.scheduleBottom}>
          <div>
            <span className={s.statusCircle}>
              <Icon name="check" />
            </span>
            <span>
              {t("Designed around your availability", "صُمم وفق أوقات التوافر")}
              <small>
                {t(
                  "Teacher, room, and student conflicts are checked automatically.",
                  "يتم التحقق من تعارض المعلمين والقاعات والطلاب تلقائياً.",
                )}
              </small>
            </span>
          </div>
          <div className={p.actions}>
            {schedule.unplaced.length > 0 && (
              <button
                className={s.warningButton}
                onClick={() => setShowUnplaced(true)}
              >
                <Icon name="warning" />
                {schedule.unplaced.length} {t("unplaced", "غير موزعة")}
              </button>
            )}
            <span className={s.utilization}>
              {Math.round((roomEntries.length / slots) * 100)}%{" "}
              {t("room utilization", "إشغال القاعة")}
            </span>
            <button className={p.subtleLink} onClick={save}>
              <Icon name="save" />
              {t("Save schedule", "حفظ الجدول")}
            </button>
          </div>
        </div>
      </section>
      <div className={s.helpStrip}>
        <span>
          <Icon name="file" />
          {t(
            "Already have a schedule? Give it a fresh start.",
            "لديك جدول بالفعل؟ امنحه بداية جديدة.",
          )}
        </span>
        <button onClick={() => navigate("import")}>
          {t("Import & edit an Excel file", "استيراد وتعديل ملف إكسل")}
          <Icon name="arrow" />
        </button>
      </div>
      {showUnplaced && (
        <Modal
          title={t("Sessions needing a place", "محاضرات تحتاج إلى توزيع")}
          onClose={() => setShowUnplaced(false)}
        >
          <p className={p.panelCaption}>
            {t(
              "The available slots could not fit these sessions. Add availability or rooms, adjust subjects, or choose an empty slot to place a session manually.",
              "تعذر توزيع هذه المحاضرات. أضف أوقات توافر أو قاعات، أو عدّل المواد، أو اختر فترة فارغة للتوزيع اليدوي.",
            )}
          </p>
          <div className={s.unplacedList}>
            {schedule.unplaced.map((e) => (
              <div key={e.id}>
                <strong>
                  {schedule.teachers.find((t) => t.id === e.teacherId)?.subject}
                </strong>
                <span>
                  {schedule.groups.find((g) => g.id === e.groupId)?.name} ·{" "}
                  {schedule.teachers.find((t) => t.id === e.teacherId)?.name}
                </span>
              </div>
            ))}
          </div>
        </Modal>
      )}
      {showSaved && (
        <Modal
          title={t("Saved schedules", "الجداول المحفوظة")}
          onClose={() => setShowSaved(false)}
        >
          {!user ? (
            <div className={p.emptyState}>
              <Icon name="lock" />
              <h3>{t("Keep your plans together", "احتفظ بخططك معاً")}</h3>
              <p>
                {t(
                  "Sign in to save and access your schedules.",
                  "سجل الدخول لحفظ جداولك والوصول إليها.",
                )}
              </p>
              <button
                className={p.primaryButton}
                style={{ marginTop: 20 }}
                onClick={() => navigate("auth")}
              >
                {t("Sign in", "تسجيل الدخول")}
                <Icon name="arrow" />
              </button>
            </div>
          ) : !saved.length ? (
            <div className={p.emptyState}>
              {t(
                "No saved schedules yet. Use Save schedule below your timetable.",
                "لا توجد جداول محفوظة. استخدم زر حفظ الجدول أسفل جدولك.",
              )}
            </div>
          ) : (
            <div className={s.savedList}>
              {saved.map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    setSchedule(item);
                    setWeek(1);
                    setShowSaved(false);
                  }}
                >
                  <Icon name="calendar" />
                  <span>
                    <strong>{item.name}</strong>
                    <small>
                      {formatDate(item.createdAt, language)} ·{" "}
                      {item.entries.length} {t("sessions", "محاضرة")}
                    </small>
                  </span>
                  <Icon name="arrow" />
                </button>
              ))}
            </div>
          )}
        </Modal>
      )}
    </div>
  );
}
