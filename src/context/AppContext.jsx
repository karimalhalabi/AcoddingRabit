import React, { createContext, useContext, useState, useEffect } from "react";
import toast from "react-hot-toast";
import {
  readStorage,
  writeStorage,
  sampleTeachers,
  defaultSettings,
  makeGroups,
  generateSchedule,
  api,
  translate,
  validateSchedule,
} from "../util/helpers.js";
const Context = createContext(null);
export function AppProvider({ children }) {
  const [language, setLanguage] = useState(() =>
    readStorage("tarteeb-language", "en"),
  );
  const [page, setPage] = useState("home");
  const [user, setUser] = useState(null);
  const [saved, setSaved] = useState([]);
  const [schedule, setSchedule] = useState(() => {
    const stored = readStorage("tarteeb-schedule", null);
    if (stored) {
      try {
        validateSchedule(stored);
        return stored;
      } catch {}
    }
    const teachers = sampleTeachers();
    return {
      ...generateSchedule(
        defaultSettings,
        teachers,
        makeGroups(defaultSettings, teachers),
      ),
      isSample: true,
    };
  });
  const [draft, setDraft] = useState(() => ({
    settings: schedule.settings,
    teachers: schedule.teachers,
    groups: schedule.groups,
  }));
  const t = (en, ar) => translate(language, en, ar);
  useEffect(() => {
    api("/auth/me")
      .then(({ user }) => setUser(user))
      .catch(() => {});
  }, []);
  useEffect(() => {
    document.documentElement.lang = language;
    document.documentElement.dir = language === "ar" ? "rtl" : "ltr";
    try {
      writeStorage("tarteeb-language", language);
    } catch {}
  }, [language]);
  useEffect(() => {
    try {
      writeStorage("tarteeb-schedule", schedule);
    } catch {
      toast.error(
        t(
          "Browser storage is full. Export your schedule to keep a copy.",
          "مساحة التخزين ممتلئة. صدّر الجدول لحفظ نسخة.",
        ),
      );
    }
  }, [schedule]);
  useEffect(() => {
    if (user)
      api("/schedules")
        .then((data) => setSaved(data.schedules))
        .catch((error) => toast.error(error.message));
    else setSaved([]);
  }, [user]);
  async function save() {
    if (!user) {
      toast.success(
        t(
          "Saved in this browser. Sign in to save to your account.",
          "تم الحفظ في هذا المتصفح. سجل الدخول للحفظ في حسابك.",
        ),
      );
      return;
    }
    try {
      await api(`/schedules/${schedule.id}`, {
        method: "PUT",
        body: JSON.stringify(schedule),
      });
      setSaved((list) => [
        schedule,
        ...list.filter((s) => s.id !== schedule.id),
      ]);
      toast.success(
        t("Schedule saved to your account", "تم حفظ الجدول في حسابك"),
      );
    } catch (error) {
      toast.error(error.message);
    }
  }
  function navigate(next) {
    setPage(next);
    document.querySelector("main")?.scrollTo({ top: 0 });
  }
  return (
    <Context.Provider
      value={{
        language,
        setLanguage,
        t,
        page,
        navigate,
        user,
        setUser,
        saved,
        schedule,
        setSchedule,
        draft,
        setDraft,
        save,
      }}
    >
      {children}
    </Context.Provider>
  );
}
export const useApp = () => useContext(Context);
