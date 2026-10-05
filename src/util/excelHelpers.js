async function newWorkbook() {
  const module = await import("exceljs");
  const ExcelJS = module.default || module;
  return new ExcelJS.Workbook();
}
import {
  days,
  getDays,
  getRooms,
  periods,
  validateInput,
  validateSchedule,
  downloadBlob,
  uid,
  dayArabic,
  roomLabel,
} from "./helpers.js";
const headers = ["Teacher Name", "Subject", "Fulltime", ...days];
const colors = ["E9E4F6", "DFF1EB", "FEEDD7", "E3EEFF", "FCE5E9", "E3F3F8"];
function styleSheet(sheet) {
  sheet.views = [{ state: "frozen", ySplit: 1 }];
  sheet.getRow(1).font = { bold: true, color: { argb: "FFFFFFFF" }, size: 12 };
  sheet.getRow(1).fill = {
    type: "pattern",
    pattern: "solid",
    fgColor: { argb: "FF0058A8" },
  };
  sheet.getRow(1).height = 30;
  sheet.eachRow((row, i) => {
    if (i > 1) {
      row.height = 25;
      row.eachCell((cell) => {
        cell.fill = {
          type: "pattern",
          pattern: "solid",
          fgColor: { argb: i % 2 ? "FFF3F6FA" : "FFFFFFFF" },
        };
        cell.alignment = { vertical: "middle", wrapText: true };
      });
    }
  });
  sheet.autoFilter = {
    from: { row: 1, column: 1 },
    to: { row: 1, column: sheet.columnCount },
  };
}
export async function teacherWorkbook(teachers) {
  const book = await newWorkbook();
  const sheet = book.addWorksheet("Teachers");
  sheet.addRow(headers);
  teachers.forEach((t) =>
    sheet.addRow([
      t.name,
      t.subject,
      t.fulltime ? "Yes" : "No",
      ...days.map((d) => (t.days.includes(d) ? "Yes" : "No")),
    ]),
  );
  sheet.columns.forEach((c, i) => {
    c.width = i < 2 ? 25 : 16;
  });
  styleSheet(sheet);
  const instructions = book.addWorksheet("Read me");
  instructions.addRow(["Tarteeb • Teacher import template"]);
  instructions.addRow([
    "Eight required columns: name, subject, full-time, and five availability days.",
  ]);
  instructions.addRow([
    "Availability is always respected, including for full-time teachers.",
  ]);
  instructions.addRow([
    "Configure room type, sessions per week, and Thursday availability in the app.",
  ]);
  instructions.addRow([
    "Assign the subjects each student group actually takes before generating.",
  ]);
  instructions.getColumn(1).width = 100;
  return book;
}
async function load(file) {
  if (!file || !file.name.toLowerCase().endsWith(".xlsx"))
    throw new Error("Please choose an .xlsx file.");
  if (file.size > 5 * 1024 * 1024)
    throw new Error("Use a workbook smaller than 5 MB.");
  const book = await newWorkbook();
  try {
    await book.xlsx.load(await file.arrayBuffer());
  } catch {
    throw new Error(
      "This file could not be read. Please choose a valid Excel workbook.",
    );
  }
  return book;
}
function value(cell) {
  const v = cell.value;
  if (v == null) return "";
  if (typeof v === "object")
    throw new Error(
      "Use plain values in Excel cells; formulas and rich text are not supported.",
    );
  return String(v).trim();
}
export async function parseTeachers(file) {
  const book = await load(file),
    sheet = book.getWorksheet("Teachers") || book.worksheets[0];
  if (!sheet || sheet.rowCount > 101)
    throw new Error("The teacher sheet must contain at most 100 teachers.");
  headers.forEach((h, i) => {
    if (value(sheet.getRow(1).getCell(i + 1)).toLowerCase() !== h.toLowerCase())
      throw new Error(
        `Column ${i + 1} must be “${h}”. Download the sample template.`,
      );
  });
  const teachers = [];
  sheet.eachRow((row, i) => {
    if (i === 1) return;
    const values = headers.map((_, j) => value(row.getCell(j + 1)));
    if (values.every((v) => !v)) return;
    const yes = (v) => {
      if (!["yes", "no"].includes(v.toLowerCase()))
        throw new Error(
          `Row ${i}: availability and Fulltime must be Yes or No.`,
        );
      return v.toLowerCase() === "yes";
    };
    teachers.push({
      id: uid(),
      name: values[0],
      subject: values[1],
      fulltime: yes(values[2]),
      days: days.filter((_, j) => yes(values[j + 3])),
      kind: "classroom",
      sessions: 1,
    });
  });
  if (
    !teachers.length ||
    teachers.some((t) => !t.name || !t.subject || !t.days.length)
  )
    throw new Error(
      "Every teacher needs a name, subject, and at least one available day.",
    );
  return teachers;
}
export async function exportSchedule(schedule, language = "en") {
  validateSchedule(schedule);
  const book = await newWorkbook();
  book.creator = "Tarteeb";
  const ar = language === "ar";
  for (const room of getRooms(schedule.settings)) {
    const sheet = book.addWorksheet(room.id);
    sheet.views = [{ state: "frozen", ySplit: 3, rightToLeft: ar }];
    sheet.mergeCells("A1:D1");
    sheet.getCell("A1").value =
      `${schedule.name} | ${roomLabel(room, language)}`;
    sheet.getCell("A1").font = {
      bold: true,
      size: 18,
      color: { argb: "FF0058A8" },
    };
    sheet.getRow(1).height = 36;
    sheet.mergeCells("A2:D2");
    sheet.getCell("A2").value = ar
      ? "ترتيب • جدول دراسي"
      : "Tarteeb • A place for every class";
    sheet.addRow([ar ? "اليوم" : "Day", ...periods]);
    sheet.getRow(3).font = { bold: true, color: { argb: "FFFFFFFF" } };
    sheet.getRow(3).fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "FF0058A8" },
    };
    for (
      let week = 1;
      week <=
      (schedule.settings.mode === "exams" ? schedule.settings.weeks : 1);
      week++
    )
      getDays(schedule.settings).forEach((day, i) => {
        const row = sheet.addRow([
          `${ar ? dayArabic[day] : day}${schedule.settings.weeks > 1 ? ` · ${ar ? "أسبوع" : "Week"} ${week}` : ""}`,
          ...periods.map((_, period) => {
            const e = schedule.entries.find(
              (e) =>
                e.roomId === room.id &&
                e.day === day &&
                e.period === period &&
                e.week === week,
            );
            if (!e) return "—";
            const t = schedule.teachers.find((t) => t.id === e.teacherId),
              g = schedule.groups.find((g) => g.id === e.groupId);
            return `${t.name}\n${t.subject}\n${g.name}${e.part ? ` · ${ar ? "قسم" : "Part"} ${e.part}` : ""} · ${e.students} ${ar ? "طالب" : "students"}`;
          }),
        ]);
        row.height = 76;
        row.eachCell((c) => {
          c.fill = {
            type: "pattern",
            pattern: "solid",
            fgColor: { argb: `FF${colors[i]}` },
          };
          c.alignment = { wrapText: true, vertical: "middle" };
        });
      });
    sheet.columns.forEach((c, i) => {
      c.width = i ? 36 : 24;
    });
    sheet.pageSetup = {
      orientation: "landscape",
      paperSize: 9,
      fitToPage: true,
      fitToWidth: 1,
      fitToHeight: 0,
    };
  }
  const instructions = book.addWorksheet("Instructions");
  instructions.addRow([
    "Edit the Sessions sheet to move classes, then import this workbook in Tarteeb.",
  ]);
  instructions.addRow([
    "Room sheets are formatted views. For edits use roomId, day, period (0–2), week in Sessions.",
  ]);
  instructions.addRow([
    "Do not change IDs, teachers, groups, part, or students. Invalid changes are rejected.",
  ]);
  instructions.addRow([
    "Unplaced sessions have placed=No. Set placed=Yes and valid timing to schedule them.",
  ]);
  instructions.getColumn(1).width = 120;
  const sessions = book.addWorksheet("Sessions");
  const keys = [
    "id",
    "teacherId",
    "groupId",
    "part",
    "students",
    "roomId",
    "day",
    "period",
    "week",
    "placed",
  ];
  sessions.addRow(keys);
  [
    ...schedule.entries.map((e) => ({ ...e, placed: "Yes" })),
    ...schedule.unplaced.map((e) => ({
      ...e,
      roomId: "",
      day: "",
      period: "",
      week: "",
      placed: "No",
    })),
  ].forEach((e) => sessions.addRow(keys.map((k) => e[k] ?? "")));
  sessions.columns.forEach((c) => {
    c.width = 22;
  });
  styleSheet(sessions);
  const meta = book.addWorksheet("_Tarteeb");
  meta.state = "veryHidden";
  const base = { ...schedule, entries: [], unplaced: [] };
  const json = JSON.stringify(base);
  for (let i = 0; i < json.length; i += 30000)
    meta.addRow([json.slice(i, i + 30000)]);
  return book;
}
export async function importSchedule(file) {
  const book = await load(file),
    meta = book.getWorksheet("_Tarteeb"),
    sheet = book.getWorksheet("Sessions");
  if (!meta || !sheet || sheet.rowCount > 10001 || meta.rowCount > 100)
    throw new Error("Choose a schedule exported by Tarteeb.");
  let json = "";
  meta.eachRow((row) => {
    json += value(row.getCell(1));
  });
  let schedule;
  try {
    schedule = JSON.parse(json);
  } catch {
    throw new Error("Schedule metadata is damaged.");
  }
  schedule.id = uid();
  schedule.createdAt = new Date().toISOString();
  schedule.entries = [];
  schedule.unplaced = [];
  const keys = [
    "id",
    "teacherId",
    "groupId",
    "part",
    "students",
    "roomId",
    "day",
    "period",
    "week",
    "placed",
  ];
  keys.forEach((key, i) => {
    if (value(sheet.getRow(1).getCell(i + 1)) !== key)
      throw new Error(
        "The Sessions columns have been changed. Use the exported column names.",
      );
  });
  sheet.eachRow((row, i) => {
    if (i === 1) return;
    const e = Object.fromEntries(
      keys.map((k, j) => [k, value(row.getCell(j + 1))]),
    );
    if (!["Yes", "No"].includes(e.placed))
      throw new Error("The placed column must be Yes or No.");
    ["part", "students", "period", "week"].forEach((k) => {
      e[k] = Number(e[k]);
    });
    (e.placed === "Yes" ? schedule.entries : schedule.unplaced).push(e);
  });
  validateInput(schedule.settings, schedule.teachers, schedule.groups);
  validateSchedule(schedule);
  return schedule;
}
export async function saveWorkbook(book, name) {
  downloadBlob(
    new Blob([await book.xlsx.writeBuffer()], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    }),
    name,
  );
}
