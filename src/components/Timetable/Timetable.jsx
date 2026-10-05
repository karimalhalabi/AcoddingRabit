import { useState } from "react";
import toast from "react-hot-toast";
import { useApp } from "../../context/AppContext.jsx";
import {
  getDays,
  getRooms,
  periods,
  dayArabic,
  roomLabel,
  moveEntry,
  unplaceEntry,
  placeEntry,
} from "../../util/helpers.js";
import Icon from "../Icon/Icon.jsx";
import Modal from "../Modal/Modal.jsx";
import p from "../../pages/page.module.css";
import s from "./Timetable.module.css";
export default function Timetable({ roomId, week }) {
  const { schedule, setSchedule, t, language } = useApp();
  const [editing, setEditing] = useState(null),
    [error, setError] = useState(""),
    [target, setTarget] = useState(null);
  const rooms = getRooms(schedule.settings),
    room = rooms.find((r) => r.id === roomId) || rooms[0];
  const activeDays = getDays(schedule.settings);
  const edit = (entry, day, period) => {
    setEditing(entry || { empty: true });
    setTarget({ roomId: room.id, day, period, week, entryId: "" });
    setError("");
  };
  const save = (e) => {
    e.preventDefault();
    try {
      const { entryId, ...location } = target;
      setSchedule(
        editing.empty
          ? placeEntry(schedule, entryId, location)
          : moveEntry(schedule, editing.id, location),
      );
      setEditing(null);
      toast.success(t("Timetable updated", "تم تحديث الجدول"));
    } catch (e) {
      setError(e.message);
    }
  };
  return (
    <>
      <div className={s.tableScroll}>
        <table className={s.timetable}>
          <thead>
            <tr>
              <th>
                <Icon name="calendar" />
                {t("Day / Period", "اليوم / الفترة")}
              </th>
              {periods.map((period, i) => (
                <th key={period}>
                  <span>
                    {t("PERIOD", "الفترة")} {String(i + 1).padStart(2, "0")}
                  </span>
                  <strong>{period}</strong>
                  <small>{t("2 hours", "ساعتان")}</small>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {activeDays.map((day, i) => (
              <tr key={day} className={s[`day${i}`]}>
                <th scope="row">
                  <span className={s.dayMarker} />
                  <strong>{language === "ar" ? dayArabic[day] : day}</strong>
                  <small>
                    {t("DAY", "اليوم")} {String(i + 1).padStart(2, "0")}
                  </small>
                </th>
                {periods.map((_, period) => {
                  const entry = schedule.entries.find(
                      (e) =>
                        e.roomId === room.id &&
                        e.week === week &&
                        e.day === day &&
                        e.period === period,
                    ),
                    teacher =
                      entry &&
                      schedule.teachers.find((t) => t.id === entry.teacherId),
                    group =
                      entry &&
                      schedule.groups.find((g) => g.id === entry.groupId);
                  return (
                    <td key={period}>
                      {entry ? (
                        <button
                          className={s.session}
                          onClick={() => edit(entry, day, period)}
                          aria-label={`${t("Edit", "تعديل")} ${teacher.subject} ${day} ${periods[period]}`}
                        >
                          <span className={s.subject}>
                            {teacher.subject}
                            <Icon name="edit" />
                          </span>
                          <span className={s.teacher}>
                            <Icon name="users" />
                            {teacher.name}
                          </span>
                          <span className={s.sessionBottom}>
                            <span>
                              {group.name}
                              {entry.part
                                ? ` · ${t("Part", "قسم")} ${entry.part}`
                                : ""}
                            </span>
                            <span>
                              {entry.students} {t("students", "طالب")}
                            </span>
                          </span>
                        </button>
                      ) : (
                        <button
                          className={s.emptySlot}
                          onClick={() => edit(null, day, period)}
                          aria-label={`${t("Add session", "إضافة محاضرة")} ${day} ${periods[period]}`}
                        >
                          <span>
                            <Icon name="plus" />
                            {t("Available slot", "فترة متاحة")}
                          </span>
                          <small>
                            {t(
                              "Room to make things happen",
                              "مساحة لمزيد من التعلم",
                            )}
                          </small>
                        </button>
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className={s.legend}>
        <div>
          {activeDays.map((day, i) => (
            <span key={day}>
              <i className={s[`legend${i}`]} />
              {language === "ar" ? dayArabic[day] : day}
            </span>
          ))}
        </div>
        <span>
          <Icon name="edit" />
          {t("Click any class to edit", "انقر على المحاضرة للتعديل")}
        </span>
      </div>
      {editing && (
        <Modal
          title={
            editing.empty
              ? t("Schedule an unplaced session", "جدولة محاضرة غير موزعة")
              : t("Edit class placement", "تعديل موعد المحاضرة")
          }
          onClose={() => setEditing(null)}
        >
          <form onSubmit={save}>
            {editing.empty ? (
              <label>
                {t("Session", "المحاضرة")}
                <select
                  required
                  value={target.entryId}
                  onChange={(e) =>
                    setTarget({ ...target, entryId: e.target.value })
                  }
                >
                  <option value="">
                    {t("Choose an unplaced session", "اختر محاضرة غير موزعة")}
                  </option>
                  {schedule.unplaced.map((e) => (
                    <option value={e.id} key={e.id}>
                      {
                        schedule.teachers.find((t) => t.id === e.teacherId)
                          ?.subject
                      }{" "}
                      · {schedule.groups.find((g) => g.id === e.groupId)?.name}
                      {e.part ? ` · ${t("Part", "قسم")} ${e.part}` : ""}
                    </option>
                  ))}
                </select>
              </label>
            ) : (
              <div className={s.editSummary}>
                <strong>
                  {
                    schedule.teachers.find((t) => t.id === editing.teacherId)
                      ?.subject
                  }
                </strong>
                <p>
                  {
                    schedule.teachers.find((t) => t.id === editing.teacherId)
                      ?.name
                  }{" "}
                  ·{" "}
                  {schedule.groups.find((g) => g.id === editing.groupId)?.name}
                </p>
              </div>
            )}
            {editing.empty && !schedule.unplaced.length && (
              <div className={p.notice}>
                {t(
                  "All required sessions are placed. Move an existing class by clicking it, or change the teaching load in Create schedule.",
                  "تم توزيع جميع المحاضرات. انقر على محاضرة لنقلها، أو عدّل العبء الدراسي في صفحة إنشاء جدول.",
                )}
              </div>
            )}
            <div className={s.editFields}>
              <label>
                {t("Room", "القاعة")}
                <select
                  value={target.roomId}
                  onChange={(e) =>
                    setTarget({ ...target, roomId: e.target.value })
                  }
                >
                  {rooms.map((r) => (
                    <option key={r.id} value={r.id}>
                      {roomLabel(r, language)}
                    </option>
                  ))}
                </select>
              </label>
              <label>
                {t("Day", "اليوم")}
                <select
                  value={target.day}
                  onChange={(e) =>
                    setTarget({ ...target, day: e.target.value })
                  }
                >
                  {activeDays.map((d) => (
                    <option key={d} value={d}>
                      {language === "ar" ? dayArabic[d] : d}
                    </option>
                  ))}
                </select>
              </label>
              <label>
                {t("Period", "الفترة")}
                <select
                  value={target.period}
                  onChange={(e) =>
                    setTarget({ ...target, period: Number(e.target.value) })
                  }
                >
                  {periods.map((p, i) => (
                    <option key={p} value={i}>
                      {p}
                    </option>
                  ))}
                </select>
              </label>
              <label>
                {t("Week", "الأسبوع")}
                <select
                  value={target.week}
                  onChange={(e) =>
                    setTarget({ ...target, week: Number(e.target.value) })
                  }
                >
                  {Array.from(
                    {
                      length:
                        schedule.settings.mode === "exams"
                          ? schedule.settings.weeks
                          : 1,
                    },
                    (_, i) => (
                      <option key={i} value={i + 1}>
                        {i + 1}
                      </option>
                    ),
                  )}
                </select>
              </label>
            </div>
            <div className={p.notice}>
              <Icon name="info" />
              {t(
                "Teacher availability, room capacity, and timetable conflicts are checked before saving.",
                "يتم التحقق من توافر المعلم وسعة القاعة وتعارض المواعيد قبل الحفظ.",
              )}
            </div>
            {error && (
              <p role="alert" className={p.error}>
                {error}
              </p>
            )}
            <div className={p.bottomActions}>
              {!editing.empty ? (
                <button
                  type="button"
                  className={p.subtleLink}
                  onClick={() => {
                    setSchedule(unplaceEntry(schedule, editing.id));
                    setEditing(null);
                    toast.success(
                      t(
                        "Session moved to unplaced list",
                        "تم نقل المحاضرة إلى قائمة الانتظار",
                      ),
                    );
                  }}
                >
                  <Icon name="trash" />
                  {t("Unplace class", "إلغاء التوزيع")}
                </button>
              ) : (
                <span />
              )}
              <button
                disabled={editing.empty && !target.entryId}
                className={p.primaryButton}
              >
                <Icon name="check" />
                {t("Save changes", "حفظ التغييرات")}
              </button>
            </div>
          </form>
        </Modal>
      )}
    </>
  );
}
