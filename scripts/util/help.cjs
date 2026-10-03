/** CRA 5 supplies an undefined allowed host on sandboxes with link-local IPs. */
function startReactScripts() {
  process.env.NODE_ENV = "development";
  process.env.HOST ||= "0.0.0.0";
  process.env.PORT ||= "3000";
  process.env.BROWSER ||= "none";
  const configPath =
    require.resolve("react-scripts/config/webpackDevServer.config");
  const createConfig = require(configPath);
  require.cache[configPath].exports = (proxy, allowedHost) => {
    const config = createConfig(proxy, allowedHost || "localhost");
    config.allowedHosts = [
      "localhost",
      ...(process.env.DEV_ALLOWED_HOSTS || "")
        .split(",")
        .map((host) => host.trim())
        .filter(Boolean),
    ];
    return config;
  };
  require("react-scripts/scripts/start");
}
module.exports = { startReactScripts };
