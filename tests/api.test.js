import test from "node:test";
import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { setTimeout } from "node:timers/promises";
import {
  defaultSettings,
  sampleTeachers,
  makeGroups,
  generateSchedule,
} from "../src/util/helpers.js";
test("accounts, server validation, ownership, save/load persistence and logout", async () => {
  const dir = await mkdtemp(join(tmpdir(), "tarteeb-test-"));
  let server;
  const port = 3107;
  const start = async () => {
    server = spawn(process.execPath, ["server/index.js"], {
      env: { ...process.env, DATA_DIR: dir, API_PORT: String(port) },
      stdio: "pipe",
    });
    let ready = false;
    server.stdout.on("data", (data) => {
      if (data.toString().includes("ready")) ready = true;
    });
    for (let i = 0; i < 100 && !ready; i++) await setTimeout(50);
    assert.ok(ready, "server ready");
  };
  const stop = async () => {
    if (!server || server.exitCode !== null) return;
    const exited = new Promise((resolve) => server.once("exit", resolve));
    server.kill();
    await exited;
  };
  const request = (path, method = "GET", data, cookie) =>
    fetch(`http://localhost:${port}/api${path}`, {
      method,
      headers: {
        "Content-Type": "application/json",
        ...(cookie ? { Cookie: cookie } : {}),
      },
      ...(data ? { body: JSON.stringify(data) } : {}),
    });
  try {
    await start();
    const allowed = await fetch(`http://localhost:${port}/api/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Origin: "http://localhost:5173",
      },
      body: JSON.stringify({
        email: "missing@example.test",
        password: "invalid",
      }),
    });
    assert.equal(
      allowed.status,
      401,
      "configured frontend origin reaches auth",
    );
    const denied = await fetch(`http://localhost:${port}/api/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Origin: "https://untrusted.example",
      },
      body: JSON.stringify({
        email: "missing@example.test",
        password: "invalid",
      }),
    });
    assert.equal(denied.status, 403, "untrusted origin is rejected");
    let response = await request("/auth/register", "POST", {
      name: "Test Admin",
      email: "test@example.test",
      password: "test-password-123",
    });
    assert.equal(response.status, 201);
    const cookie = response.headers.get("set-cookie").split(";")[0];
    response = await request("/auth/me", "GET", null, cookie);
    assert.equal((await response.json()).user.name, "Test Admin");
    const teachers = sampleTeachers(),
      schedule = generateSchedule(
        defaultSettings,
        teachers,
        makeGroups(defaultSettings, teachers),
      );
    response = await request(`/schedules/${schedule.id}`, "PUT", schedule);
    assert.equal(response.status, 401);
    response = await request(
      `/schedules/${schedule.id}`,
      "PUT",
      schedule,
      cookie,
    );
    assert.equal(response.status, 200);
    response = await request(
      `/schedules/${schedule.id}`,
      "PUT",
      { ...schedule, entries: [] },
      cookie,
    );
    assert.equal(response.status, 400);
    await stop();
    await start();
    response = await request("/schedules", "GET", null, cookie);
    assert.equal(
      (await response.json()).schedules[0].entries.length,
      schedule.entries.length,
    );
    response = await request("/auth/register", "POST", {
      name: "Other Admin",
      email: "other@example.test",
      password: "test-password-123",
    });
    const otherCookie = response.headers.get("set-cookie").split(";")[0];
    response = await request("/schedules", "GET", null, otherCookie);
    assert.deepEqual((await response.json()).schedules, []);
    response = await request("/auth/login", "POST", {
      email: "test@example.test",
      password: "wrong",
    });
    assert.equal(response.status, 401);
    response = await request("/auth/logout", "POST", {}, cookie);
    assert.equal(response.status, 200);
    response = await request("/schedules", "GET", null, cookie);
    assert.equal(response.status, 401);
  } finally {
    await stop();
    await rm(dir, { recursive: true, force: true });
  }
});
