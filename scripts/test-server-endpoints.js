const http = require("http");
const { spawn } = require("child_process");

async function checkUrl(url, timeoutMs = 4000) {
  return new Promise((resolve, reject) => {
    const req = http.get(url, (res) => {
      let data = "";
      res.on("data", (chunk) => (data += chunk));
      res.on("end", () => {
        resolve({ statusCode: res.statusCode, body: data });
      });
    });
    req.on("error", reject);
    setTimeout(() => {
      req.destroy();
      reject(new Error("Timeout"));
    }, timeoutMs);
  });
}

async function main() {
  console.log("Starting Next.js production server for endpoint verification on port 3000...");
  const server = spawn("npx", ["next", "start", "-p", "3000"], {
    shell: true,
    stdio: "inherit",
  });

  // Wait for server to boot up
  let booted = false;
  for (let i = 0; i < 20; i++) {
    await new Promise((r) => setTimeout(r, 1000));
    try {
      const res = await checkUrl("http://localhost:3000/");
      if (res.statusCode === 200) {
        booted = true;
        console.log("✓ Server booted successfully!");
        break;
      }
    } catch (e) {
      process.stdout.write(".");
    }
  }

  if (!booted) {
    server.kill();
    throw new Error("Server failed to boot within 20 seconds.");
  }

  try {
    const endpoints = [
      "/",
      "/services",
      "/bridal",
      "/mehendi",
      "/gallery",
      "/stylists",
      "/quiz",
      "/try-on",
      "/lookboard",
      "/offers",
      "/memberships",
      "/blog",
      "/about",
      "/contact",
      "/login",
      "/register",
      "/api/slots?date=2026-11-20&duration=45",
    ];

    for (const ep of endpoints) {
      const res = await checkUrl(`http://localhost:3000${ep}`);
      console.log(`✓ [HTTP ${res.statusCode}] http://localhost:3000${ep}`);
      if (res.statusCode !== 200) {
        throw new Error(`Endpoint ${ep} returned status ${res.statusCode}`);
      }
    }

    console.log("\nALL 17 CRITICAL USER & API ROUTES RETURNED HTTP 200 OK!");
  } finally {
    console.log("Shutting down test server...");
    server.kill();
    // On Windows, force kill child processes if any
    spawn("taskkill", ["/pid", server.pid.toString(), "/f", "/t"], { shell: true });
  }
}

main().catch((err) => {
  console.error("Verification failed:", err);
  process.exit(1);
});
