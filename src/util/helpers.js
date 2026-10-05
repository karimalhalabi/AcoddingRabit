export const days = ["Saturday", "Sunday", "Monday", "Tuesday", "Wednesday"];
export const periods = ["09:00 – 11:00", "11:00 – 13:00", "13:00 – 15:00"];
export const dayArabic = {
  Saturday: "السبت",
  Sunday: "الأحد",
  Monday: "الاثنين",
  Tuesday: "الثلاثاء",
  Wednesday: "الأربعاء",
  Thursday: "الخميس",
};
export const defaultSettings = {
  term: "Fall semester 2026",
  studentCount: 1500,
  classroomCount: 10,
  labCount: 5,
  classCapacity: 40,
  labCapacity: 20,
  mode: "classes",
  weeks: 1,
};
export const uid = () => globalThis.crypto.randomUUID();
export function translate(language, en, ar) {
  return language === "ar" ? ar : en;
}
export function getDays(settings) {
  return settings.mode === "exams" ? [...days, "Thursday"] : days;
}
export function getRooms(settings) {
  return [
    ...Array.from({ length: settings.classroomCount }, (_, i) => ({
      id: `C${i + 1}`,
      name: `Classroom ${String(i + 1).padStart(2, "0")}`,
      kind: "classroom",
      capacity: settings.classCapacity,
    })),
    ...Array.from({ length: settings.labCount }, (_, i) => ({
      id: `L${i + 1}`,
      name: `Laboratory ${String(i + 1).padStart(2, "0")}`,
      kind: "lab",
      capacity: settings.labCapacity,
    })),
  ];
}
export function sampleTeachers() {
  const names = [
    "Sarah Mitchell",
    "Omar Hassan",
    "Emily Carter",
    "Ahmed Khalil",
    "Nora Williams",
    "Youssef Ali",
    "Olivia Bennett",
    "Karim Nasser",
    "Layla Morgan",
    "Daniel Brooks",
    "Sofia Ahmed",
    "Adam Wilson",
    "Maya Ibrahim",
    "James Parker",
    "Hana Saleh",
    "Ryan Clarke",
    "Leila Osman",
    "Noah Roberts",
    "Amir Farouk",
    "Isabella Reed",
    "Zain Malik",
    "Chloe Martin",
    "Tariq Mansour",
    "Grace Thompson",
  ];
  const subjects = [
    "Mathematics",
    "Physics",
    "Computer Science",
    "English Literature",
    "Chemistry",
    "Business Studies",
    "Biology",
    "Statistics",
    "Architecture",
    "Economics",
    "Graphic Design",
    "Engineering",
    "Psychology",
    "History",
    "Environmental Science",
    "Digital Media",
    "Accounting",
    "Sociology",
    "Philosophy",
    "Communication",
    "Data Science",
    "Political Science",
    "Research Methods",
    "Art & Design",
  ];
  return names.map((name, i) => ({
    id: `t${i + 1}`,
    name,
    subject: subjects[i],
    fulltime: i < 16,
    days:
      i >= 16
        ? ["Saturday"]
        : i === 13
          ? ["Sunday", "Tuesday"]
          : i === 14
            ? ["Monday", "Wednesday"]
            : i === 15
              ? ["Saturday", "Tuesday"]
              : [...days],
    kind: [1, 2, 4, 6].includes(i) ? "lab" : "classroom",
    sessions: 1,
  }));
}
export function makeGroups(settings, teachers) {
  const count = Math.ceil(settings.studentCount / settings.classCapacity);
  const regular = teachers.filter((t) => t.fulltime);
  const pool = regular.length ? regular : teachers;
  return Array.from({ length: count }, (_, i) => ({
    id: `g${i + 1}`,
    name: `Group ${String(i + 1).padStart(2, "0")}`,
    students: Math.min(
      settings.classCapacity,
      settings.studentCount - i * settings.classCapacity,
    ),
    subjects: pool.length
      ? [
          ...new Set([
            pool[i % pool.length].id,
            teachers[(i + 5) % teachers.length].id,
          ]),
        ]
      : [],
  }));
}
export function validateInput(settings, teachers, groups) {
  for (const [key, min, max] of [
    ["studentCount", 1, 10000],
    ["classroomCount", 1, 50],
    ["labCount", 0, 30],
    ["classCapacity", 1, 200],
    ["labCapacity", 1, 100],
    ["weeks", 1, 8],
  ])
    if (
      !Number.isInteger(settings[key]) ||
      settings[key] < min ||
      settings[key] > max
    )
      throw new Error(
        `Invalid ${key}: enter an integer from ${min} to ${max}.`,
      );
  if (
    !["classes", "exams"].includes(settings.mode) ||
    typeof settings.term !== "string" ||
    !settings.term.trim() ||
    settings.term.length > 100
  )
    throw new Error("Enter a valid schedule title and mode.");
  if (!Array.isArray(teachers) || !teachers.length || teachers.length > 100)
    throw new Error("Add between 1 and 100 teachers.");
  const ids = new Set();
  for (const t of teachers) {
    if (
      typeof t.id !== "string" ||
      ids.has(t.id) ||
      !t.name?.trim() ||
      !t.subject?.trim() ||
      t.name.length > 100 ||
      t.subject.length > 100 ||
      typeof t.fulltime !== "boolean" ||
      !Array.isArray(t.days) ||
      !t.days.length ||
      t.days.some((d) => ![...days, "Thursday"].includes(d)) ||
      !["classroom", "lab"].includes(t.kind) ||
      !Number.isInteger(t.sessions) ||
      t.sessions < 1 ||
      t.sessions > 6
    )
      throw new Error(
        "Check teacher names, subjects, availability, room type, and sessions (1–6).",
      );
    ids.add(t.id);
  }
  if (!Array.isArray(groups) || !groups.length || groups.length > 500)
    throw new Error("Add between 1 and 500 student groups.");
  const groupIds = new Set();
  for (const g of groups) {
    if (
      typeof g.id !== "string" ||
      groupIds.has(g.id) ||
      typeof g.name !== "string" ||
      !g.name.trim() ||
      g.name.length > 100 ||
      !Number.isInteger(g.students) ||
      g.students < 1 ||
      g.students > settings.classCapacity ||
      !Array.isArray(g.subjects) ||
      !g.subjects.length ||
      new Set(g.subjects).size !== g.subjects.length ||
      g.subjects.some((id) => !ids.has(id))
    )
      throw new Error(
        "Every group needs a name, a valid size, and at least one distinct subject.",
      );
    groupIds.add(g.id);
  }
  if (groups.reduce((sum, g) => sum + g.students, 0) !== settings.studentCount)
    throw new Error(
      "Student group sizes must add up to the total number of students.",
    );
}
export function buildTasks(settings, teachers, groups) {
  const tasks = [];
  groups.forEach((g) =>
    g.subjects.forEach((id) => {
      const t = teachers.find((t) => t.id === id);
      const parts =
        t.kind === "lab" ? Math.ceil(g.students / settings.labCapacity) : 1;
      const sessions = settings.mode === "exams" ? 1 : t.sessions;
      // Check expansion before allocating tasks, including on server validation.
      if (tasks.length + parts * sessions > 10000)
        throw new Error(
          "Reduce the teaching load: at most 10,000 sessions are supported.",
        );
      for (let part = 0; part < parts; part++)
        for (let n = 0; n < sessions; n++)
          tasks.push({
            id: `${g.id}-${t.id}-${part}-${n}`,
            teacherId: t.id,
            groupId: g.id,
            part: parts > 1 ? part + 1 : 0,
            students:
              parts > 1
                ? Math.min(
                    settings.labCapacity,
                    g.students - part * settings.labCapacity,
                  )
                : g.students,
          });
    }),
  );
  return tasks;
}
export function generateSchedule(settings, teachers, groups) {
  validateInput(settings, teachers, groups);
  const rooms = getRooms(settings),
    activeDays = getDays(settings),
    weeks = settings.mode === "exams" ? settings.weeks : 1;
  const tasks = buildTasks(settings, teachers, groups);
  if (tasks.length > 10000)
    throw new Error(
      "Reduce the number of groups, subjects, or weekly sessions.",
    );
  const lookup = Object.fromEntries(teachers.map((t) => [t.id, t]));
  let best = null;
  for (let attempt = 0; attempt < 5; attempt++) {
    const entries = [],
      unplaced = [],
      occupied = new Set(),
      load = {};
    const sorted = [...tasks].sort(
      (a, b) =>
        lookup[a.teacherId].days.filter((d) => activeDays.includes(d)).length -
          lookup[b.teacherId].days.filter((d) => activeDays.includes(d))
            .length ||
        ((hash(a.id) + attempt * hash(a.groupId)) % 997) -
          ((hash(b.id) + attempt * hash(b.groupId)) % 997),
    );
    for (const task of sorted) {
      const teacher = lookup[task.teacherId];
      let chosen = null,
        bestScore = Infinity;
      for (let week = 1; week <= weeks; week++)
        for (const [di, day] of activeDays.entries()) {
          if (!teacher.days.includes(day)) continue;
          for (let period = 0; period < 3; period++) {
            const slot = `${week}:${day}:${period}`;
            if (
              occupied.has(`${slot}:t:${teacher.id}`) ||
              occupied.has(`${slot}:g:${task.groupId}`)
            )
              continue;
            for (const room of rooms) {
              if (
                room.kind !== teacher.kind ||
                room.capacity < task.students ||
                occupied.has(`${slot}:r:${room.id}`)
              )
                continue;
              const score =
                (load[`${week}:${day}:${task.groupId}`] || 0) * 20 +
                (load[`${week}:${day}`] || 0) * 2 +
                week * 100 +
                period +
                di * 0.1 +
                Number(room.id.slice(1)) * 0.02;
              if (score < bestScore) {
                bestScore = score;
                chosen = { ...task, roomId: room.id, day, period, week };
              }
            }
          }
        }
      if (chosen) {
        entries.push(chosen);
        const slot = `${chosen.week}:${chosen.day}:${chosen.period}`;
        occupied.add(`${slot}:t:${teacher.id}`);
        occupied.add(`${slot}:g:${task.groupId}`);
        occupied.add(`${slot}:r:${chosen.roomId}`);
        for (const key of [
          `${chosen.week}:${chosen.day}`,
          `${chosen.week}:${chosen.day}:${task.groupId}`,
        ])
          load[key] = (load[key] || 0) + 1;
      } else
        unplaced.push({
          ...task,
          reason:
            "No available slot fits teacher availability, group timetable, and room capacity.",
        });
    }
    if (!best || unplaced.length < best.unplaced.length)
      best = { entries, unplaced };
    if (!unplaced.length) break;
  }
  return {
    ...best,
    id: uid(),
    name: settings.term,
    createdAt: new Date().toISOString(),
    settings: { ...settings },
    teachers: structuredClone(teachers),
    groups: structuredClone(groups),
  };
}
function hash(value) {
  return [...value].reduce((h, c) => (h * 31 + c.charCodeAt(0)) >>> 0, 0);
}
export function validateSchedule(schedule) {
  if (
    !schedule ||
    typeof schedule.id !== "string" ||
    !schedule.id ||
    schedule.id.length > 100 ||
    typeof schedule.name !== "string" ||
    !schedule.name.trim() ||
    schedule.name.length > 100 ||
    typeof schedule.createdAt !== "string" ||
    !Number.isFinite(Date.parse(schedule.createdAt))
  )
    throw new Error("Invalid schedule identity, title, or date.");
  if (
    !schedule ||
    !Array.isArray(schedule.entries) ||
    !Array.isArray(schedule.unplaced) ||
    schedule.entries.length + schedule.unplaced.length > 10000
  )
    throw new Error("Invalid schedule data.");
  const { settings, teachers, groups } = schedule;
  validateInput(settings, teachers, groups);
  const rooms = getRooms(settings),
    occupied = new Set(),
    entryIds = new Set();
  for (const e of schedule.entries) {
    const t = teachers.find((t) => t.id === e.teacherId),
      g = groups.find((g) => g.id === e.groupId),
      r = rooms.find((r) => r.id === e.roomId);
    if (
      !t ||
      !g ||
      !r ||
      !g.subjects.includes(t.id) ||
      !getDays(settings).includes(e.day) ||
      !t.days.includes(e.day) ||
      !Number.isInteger(e.period) ||
      e.period < 0 ||
      e.period > 2 ||
      !Number.isInteger(e.week) ||
      e.week < 1 ||
      e.week > (settings.mode === "exams" ? settings.weeks : 1) ||
      r.kind !== t.kind ||
      !Number.isInteger(e.students) ||
      e.students < 1 ||
      e.students > r.capacity ||
      e.students > g.students ||
      typeof e.id !== "string" ||
      entryIds.has(e.id)
    )
      throw new Error(
        "A session has invalid availability, group, room, capacity, or timing.",
      );
    entryIds.add(e.id);
    const slot = `${e.week}:${e.day}:${e.period}`;
    for (const key of [
      `${slot}:t:${t.id}`,
      `${slot}:g:${g.id}`,
      `${slot}:r:${r.id}`,
    ]) {
      if (occupied.has(key))
        throw new Error(
          "This change creates a teacher, student group, or room conflict. Choose another slot.",
        );
      occupied.add(key);
    }
  }
  const expected = new Map(
    buildTasks(settings, teachers, groups).map((t) => [t.id, t]),
  );
  for (const e of [...schedule.entries, ...schedule.unplaced]) {
    const task = expected.get(e.id);
    if (
      !task ||
      ["teacherId", "groupId", "part", "students"].some((k) => task[k] !== e[k])
    )
      throw new Error(
        "The workbook has missing, duplicate, or altered course sessions.",
      );
    expected.delete(e.id);
  }
  if (expected.size)
    throw new Error("The workbook is missing required sessions.");
  return true;
}
export function moveEntry(schedule, entryId, change) {
  const next = {
    ...schedule,
    entries: schedule.entries.map((e) =>
      e.id === entryId ? { ...e, ...change } : e,
    ),
  };
  validateSchedule(next);
  return next;
}
export function placeEntry(schedule, entryId, change) {
  const entry = schedule.unplaced.find((e) => e.id === entryId);
  if (!entry) throw new Error("Select an unplaced session.");
  const next = {
    ...schedule,
    entries: [...schedule.entries, { ...entry, ...change }],
    unplaced: schedule.unplaced.filter((e) => e.id !== entryId),
  };
  validateSchedule(next);
  return next;
}
export function unplaceEntry(schedule, entryId) {
  const entry = schedule.entries.find((e) => e.id === entryId);
  const next = {
    ...schedule,
    entries: schedule.entries.filter((e) => e.id !== entryId),
    unplaced: [
      ...schedule.unplaced,
      { ...entry, reason: "Removed from the timetable for rescheduling." },
    ],
  };
  validateSchedule(next);
  return next;
}
export function readStorage(key, fallback) {
  try {
    return JSON.parse(localStorage.getItem(key)) ?? fallback;
  } catch {
    return fallback;
  }
}
export function writeStorage(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}
export async function api(path, options = {}) {
  const response = await fetch(`/api${path}`, {
    ...options,
    headers: { "Content-Type": "application/json", ...options.headers },
  });
  const body = await response.json();
  if (!response.ok) throw new Error(body.error || "Request failed.");
  return body;
}
export function initials(name) {
  return name
    .split(" ")
    .slice(0, 2)
    .map((n) => n[0])
    .join("");
}
export function formatDate(value, language = "en") {
  return new Intl.DateTimeFormat(language === "ar" ? "ar" : "en", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(value));
}
export function roomLabel(room, language) {
  return language === "ar"
    ? `${room.kind === "lab" ? "مختبر" : "قاعة"} ${room.id.slice(1)}`
    : room.name;
}
export function downloadBlob(blob, name) {
  const url = URL.createObjectURL(blob),
    link = document.createElement("a");
  link.href = url;
  link.download = name;
  link.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
