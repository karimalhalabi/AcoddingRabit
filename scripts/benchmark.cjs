process.env.NODE_ENV = "test";
const http = require("node:http");
const { performance } = require("node:perf_hooks");
const { createApp } = require("../server/app.cjs");
const { app, db } = createApp(":memory:");
const concurrency = 100;
const rounds = 30;
const agent = new http.Agent({ keepAlive: true, maxSockets: concurrency });
const latencies = [];
const server = app.listen(0, "127.0.0.1", async () => {
  const port = server.address().port;
  const request = () =>
    new Promise((resolve, reject) => {
      const start = performance.now();
      http
        .get(
          {
            hostname: "127.0.0.1",
            port,
            path: "/api/shops/terra/products",
            agent,
          },
          (response) => {
            response.resume();
            response.on("end", () =>
              response.statusCode === 200
                ? resolve(performance.now() - start)
                : reject(new Error(`HTTP ${response.statusCode}`)),
            );
          },
        )
        .on("error", reject);
    });
  try {
    await Promise.all(Array.from({ length: concurrency }, request));
    const start = performance.now();
    await Promise.all(
      Array.from({ length: concurrency }, async () => {
        for (let i = 0; i < rounds; i++) latencies.push(await request());
      }),
    );
    const seconds = (performance.now() - start) / 1000;
    latencies.sort((a, b) => a - b);
    const result = {
      scope:
        "Local loopback, warm catalog cache, isolated seeded SQLite, one Express process; excludes deployment network and password hashing",
      concurrency,
      requests: latencies.length,
      seconds: Number(seconds.toFixed(2)),
      requestsPerSecond: Number((latencies.length / seconds).toFixed(1)),
      p50Ms: Number(latencies[Math.floor(latencies.length * 0.5)].toFixed(2)),
      p95Ms: Number(latencies[Math.floor(latencies.length * 0.95)].toFixed(2)),
      p99Ms: Number(latencies[Math.floor(latencies.length * 0.99)].toFixed(2)),
      maxMs: Number(latencies.at(-1).toFixed(2)),
    };
    console.log(JSON.stringify(result, null, 2));
    if (result.requestsPerSecond < 100 || result.p95Ms >= 100)
      process.exitCode = 1;
  } catch (error) {
    console.error(error);
    process.exitCode = 1;
  } finally {
    agent.destroy();
    server.close(() => db.close());
  }
});
