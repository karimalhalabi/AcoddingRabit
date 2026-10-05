// React Scripts 5 passes an undefined allowedHost on cloud sandboxes whose
// network address is outside RFC1918. Keep host checking enabled and supply
// the configured frontend hostnames as explicit fallbacks.
process.env.NODE_ENV = "development";
process.env.BABEL_ENV = "development";
const configPath =
  require.resolve("react-scripts/config/webpackDevServer.config.js");
const createConfig = require(configPath);
require.cache[configPath].exports = (proxy, allowedHost) => {
  const config = createConfig(proxy, allowedHost || "localhost");
  const configured = (
    process.env.APP_ORIGINS || "http://localhost:5173,http://127.0.0.1:5173"
  )
    .split(",")
    .map((origin) => new URL(origin.trim()).hostname);
  config.allowedHosts = [
    ...new Set([
      "localhost",
      "127.0.0.1",
      ...configured,
      ...(allowedHost ? [allowedHost] : []),
    ]),
  ];
  return config;
};
require("react-scripts/scripts/start.js");
