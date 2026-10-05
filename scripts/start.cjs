const { spawn } = require("node:child_process");
const cra = process.argv.includes("--react-scripts");
const children = [
  spawn(process.execPath, ["server/index.js"], { stdio: "inherit" }),
  spawn(
    process.execPath,
    [
      cra
        ? require("node:path").join(__dirname, "start-cra.cjs")
        : require("node:path").join(
            require("node:path").dirname(require.resolve("vite/package.json")),
            "bin/vite.js",
          ),
      ...(cra ? [] : ["--host", "0.0.0.0"]),
    ],
    {
      stdio: "inherit",
      env: {
        ...process.env,
        BROWSER: "none",
        HOST: "0.0.0.0",
        PORT: process.env.PORT || "5173",
      },
    },
  ),
];
let stopping = false;
function stop(code = 0) {
  if (stopping) return;
  stopping = true;
  children.forEach((child) => child.kill("SIGTERM"));
  process.exitCode = code;
}
children.forEach((child) => {
  child.on("error", (error) => {
    console.error(error);
    stop(1);
  });
  child.on("exit", (code) => stop(code || 0));
});
process.on("SIGINT", () => stop());
process.on("SIGTERM", () => stop());
