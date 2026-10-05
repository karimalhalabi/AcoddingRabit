import test from "node:test";
import assert from "node:assert/strict";
import {
  defaultSettings,
  sampleTeachers,
  makeGroups,
  generateSchedule,
  validateSchedule,
  moveEntry,
  unplaceEntry,
  placeEntry,
  buildTasks,
} from "../src/util/helpers.js";
const settings = { ...defaultSettings };
test("1500 student schedule accounts for every required session and has no conflicts", () => {
  const teachers = sampleTeachers(),
    groups = makeGroups(settings, teachers),
    schedule = generateSchedule(settings, teachers, groups);
  assert.equal(
    groups.reduce((n, g) => n + g.students, 0),
    1500,
  );
  assert.equal(validateSchedule(schedule), true);
  assert.equal(
    schedule.entries.length + schedule.unplaced.length,
    buildTasks(settings, teachers, groups).length,
  );
  assert.equal(schedule.unplaced.length, 0);
  assert.equal(
    new Set(schedule.entries.map((entry) => entry.teacherId)).size,
    teachers.length,
  );
  assert.ok(schedule.entries.some((e) => e.part === 2 && e.students === 20));
});
test("constrained Saturday teacher is never scheduled on another day and overflow is explicit", () => {
  const teachers = [
      { ...sampleTeachers()[0], days: ["Saturday"], fulltime: false },
    ],
    groups = makeGroups({ ...settings, studentCount: 200 }, teachers),
    schedule = generateSchedule(
      { ...settings, studentCount: 200 },
      teachers,
      groups,
    );
  assert.equal(schedule.entries.length, 3);
  assert.equal(schedule.unplaced.length, 2);
  assert.ok(schedule.entries.every((e) => e.day === "Saturday"));
  assert.equal(validateSchedule(schedule), true);
});
test("exam Thursday and next week are respected", () => {
  const teachers = [{ ...sampleTeachers()[0], days: ["Thursday"] }],
    exam = { ...settings, studentCount: 200, mode: "exams", weeks: 2 },
    schedule = generateSchedule(exam, teachers, makeGroups(exam, teachers));
  assert.equal(schedule.entries.length, 5);
  assert.equal(schedule.unplaced.length, 0);
  assert.ok(schedule.entries.every((e) => e.day === "Thursday"));
  assert.ok(schedule.entries.some((e) => e.week === 2));
});
test("manual editing rejects collision and unavailable day; unplacing and placing preserves required sessions", () => {
  const teachers = [{ ...sampleTeachers()[0], days: ["Saturday"] }],
    config = { ...settings, studentCount: 120 },
    schedule = generateSchedule(config, teachers, makeGroups(config, teachers)),
    [a, b] = schedule.entries;
  assert.throws(
    () =>
      moveEntry(schedule, a.id, {
        roomId: b.roomId,
        day: b.day,
        period: b.period,
        week: b.week,
      }),
    /conflict/,
  );
  assert.throws(
    () => moveEntry(schedule, a.id, { day: "Sunday" }),
    /availability/,
  );
  const pending = unplaceEntry(schedule, a.id);
  assert.equal(pending.unplaced.length, 1);
  assert.equal(
    validateSchedule(
      placeEntry(pending, a.id, {
        roomId: a.roomId,
        day: a.day,
        period: a.period,
        week: a.week,
      }),
    ),
    true,
  );
});
test("missing, duplicated, changed student counts and invalid teaching loads are rejected", () => {
  const teachers = sampleTeachers(),
    groups = makeGroups(settings, teachers),
    schedule = generateSchedule(settings, teachers, groups);
  assert.throws(
    () => validateSchedule({ ...schedule, entries: schedule.entries.slice(1) }),
    /missing/,
  );
  assert.throws(
    () =>
      validateSchedule({
        ...schedule,
        entries: [...schedule.entries, schedule.entries[0]],
      }),
    /invalid|conflict/,
  );
  assert.throws(
    () =>
      validateSchedule({
        ...schedule,
        entries: schedule.entries.map((e, i) =>
          i ? e : { ...e, students: 1 },
        ),
      }),
    /altered/,
  );
  assert.throws(
    () => generateSchedule({ ...settings, studentCount: 0 }, teachers, groups),
    /studentCount/,
  );
  assert.throws(
    () =>
      generateSchedule(
        settings,
        teachers,
        groups.map((g, i) => (i ? g : { ...g, subjects: [] })),
      ),
    /group/,
  );
});

test("oversized laboratory expansion is bounded before allocation", () => {
  const settings = { ...defaultSettings, studentCount: 10000, labCapacity: 1 };
  const teachers = sampleTeachers().map((t) => ({
    ...t,
    kind: "lab",
    sessions: 6,
  }));
  const groups = makeGroups(settings, teachers).map((g) => ({
    ...g,
    subjects: teachers.map((t) => t.id),
  }));
  assert.throws(
    () => generateSchedule(settings, teachers, groups),
    /10,000 sessions/,
  );
});
