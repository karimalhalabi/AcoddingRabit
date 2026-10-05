import { mkdir } from "node:fs/promises";
import { teacherWorkbook, exportSchedule } from "../src/util/excelHelpers.js";
import {
  sampleTeachers,
  defaultSettings,
  makeGroups,
  generateSchedule,
} from "../src/util/helpers.js";
await mkdir("public/samples", { recursive: true });
const teachers = sampleTeachers();
await (
  await teacherWorkbook(teachers)
).xlsx.writeFile("public/samples/teachers-sample.xlsx");
const schedule = generateSchedule(
  defaultSettings,
  teachers,
  makeGroups(defaultSettings, teachers),
);
await (
  await exportSchedule(schedule)
).xlsx.writeFile("public/samples/schedule-sample.xlsx");
console.log(
  `Samples generated: ${teachers.length} teachers, ${schedule.entries.length} scheduled, ${schedule.unplaced.length} unplaced.`,
);
