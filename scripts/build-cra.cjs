const { spawnSync } = require("node:child_process");
const result = spawnSync(
  process.execPath,
  [require.resolve("react-scripts/bin/react-scripts.js"), "build"],
  {
    stdio: "inherit",
    env: {
      ...process.env,
      DISABLE_ESLINT_PLUGIN: "true",
      GENERATE_SOURCEMAP: "false",
    },
  },
);
process.exit(result.status || 0);
