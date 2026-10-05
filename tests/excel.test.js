import test from "node:test";
import assert from "node:assert/strict";
import {
  sampleTeachers,
  defaultSettings,
  makeGroups,
  generateSchedule,
  validateSchedule,
} from "../src/util/helpers.js";
import {
  teacherWorkbook,
  parseTeachers,
  exportSchedule,
  importSchedule,
} from "../src/util/excelHelpers.js";
async function file(book) {
  return new File([await book.xlsx.writeBuffer()], "schedule.xlsx");
}
test("eight-column teacher template round trips names and availability", async () => {
  const teachers = sampleTeachers(),
    book = await teacherWorkbook(teachers);
  assert.equal(book.getWorksheet("Teachers").columnCount, 8);
  const result = await parseTeachers(await file(book));
  assert.equal(result.length, 24);
  assert.equal(result[16].fulltime, false);
  assert.deepEqual(result[16].days, ["Saturday"]);
  assert.equal(result[0].name, teachers[0].name);
});
test("schedule workbook includes formatted room views and imports losslessly", async () => {
  const teachers = sampleTeachers(),
    schedule = generateSchedule(
      defaultSettings,
      teachers,
      makeGroups(defaultSettings, teachers),
    );
  const book = await exportSchedule(schedule);
  assert.equal(book.getWorksheet("C1").getCell("A1").font.size, 18);
  assert.equal(
    book.getWorksheet("C1").getCell("A4").fill.fgColor.argb,
    "FFE9E4F6",
  );
  const result = await importSchedule(await file(book));
  assert.equal(validateSchedule(result), true);
  assert.equal(result.entries.length, schedule.entries.length);
  assert.deepEqual(result.teachers, schedule.teachers);
  assert.notEqual(result.id, schedule.id);
});
test("workbook import rejects a conflicting change and missing sessions", async () => {
  const teachers = sampleTeachers(),
    schedule = generateSchedule(
      defaultSettings,
      teachers,
      makeGroups(defaultSettings, teachers),
    ),
    book = await exportSchedule(schedule);
  const sheet = book.getWorksheet("Sessions");
  sheet.getRow(2).getCell(7).value = "Friday";
  await assert.rejects(
    async () => importSchedule(await file(book)),
    /availability/,
  );
  sheet.getRow(2).getCell(7).value = schedule.entries[0].day;
  sheet.spliceRows(2, 1);
  await assert.rejects(async () => importSchedule(await file(book)), /missing/);
});
test("teacher validation rejects malformed Yes/No and formula cells", async () => {
  const book = await teacherWorkbook(sampleTeachers());
  book.getWorksheet("Teachers").getRow(2).getCell(3).value = "Maybe";
  await assert.rejects(
    async () => parseTeachers(await file(book)),
    /Yes or No/,
  );
  book.getWorksheet("Teachers").getRow(2).getCell(3).value = {
    formula: "1+1",
    result: 2,
  };
  await assert.rejects(
    async () => parseTeachers(await file(book)),
    /plain values/,
  );
});
