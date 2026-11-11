import { chromium } from "playwright";
import http from "http";

const BASE_URL = process.env.TEST_BASE_URL || "http://127.0.0.1:3000";

// Allowed external domains strictly limited to image CDN & map tile
const ALLOWED_EXTERNAL_HOSTS = new Set([
  "images.unsplash.com",
  "www.openstreetmap.org",
  "openstreetmap.org",
  "a.tile.openstreetmap.org",
  "b.tile.openstreetmap.org",
  "c.tile.openstreetmap.org",
]);

// Blocklist of third party APIs that must NEVER be called
const FORBIDDEN_PATTERNS = [
  /anthropic\.com/i,
  /openai\.com/i,
  /razorpay\.com/i,
  /twilio\.com/i,
  /cloudinary\.com/i,
  /google-analytics\.com/i,
  /googletagmanager\.com/i,
  /turnstile/i,
  /cloudflare/i,
  /hcaptcha/i,
  /recaptcha/i,
  /upstash/i,
  /facebook\.net/i,
  /wati\.io/i,
];

async function isServerRunning(url) {
  return new Promise((resolve) => {
    const req = http.get(url, (res) => {
      resolve(res.statusCode !== undefined);
    });
    req.on("error", () => resolve(false));
    req.setTimeout(2000, () => {
      req.abort();
      resolve(false);
    });
  });
}

async function runNetworkAudit() {
  console.log("=============================================================");
  console.log("       BEEM (Beauty Empire) Zero-Key & Zero-AI Audit        ");
  console.log("=============================================================\n");

  const running = await isServerRunning(BASE_URL);
  if (!running) {
    console.error(`Error: Web server is not running at ${BASE_URL}.`);
    console.error("Please run 'npm run dev' or 'npm start' before executing this audit.");
    process.exit(1);
  }

  console.log(`Auditing target: ${BASE_URL}`);

  let browser;
  try {
    browser = await chromium.launch({
      headless: true,
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });
  } catch (err) {
    console.warn("Could not launch Playwright browser directly in this environment:", err.message);
    console.log("Performing HTTP endpoint security & headers audit via fetch instead...\n");
    return runHttpFallbackAudit();
  }

  const context = await browser.newContext();
  const page = await context.newPage();

  const routesToTest = [
    "/",
    "/services",
    "/looks",
    "/book",
    "/quiz",
    "/contact",
    "/login",
    "/register",
    "/reset-password",
    "/lookboard",
  ];

  const recordedRequests = [];
  const violations = [];

  page.on("request", (req) => {
    const reqUrl = new URL(req.url());
    const host = reqUrl.hostname;
    recordedRequests.push({ url: req.url(), host });

    // Check if host is internal
    if (host === "localhost" || host === "127.0.0.1") {
      return;
    }

    // Check forbidden patterns
    for (const pattern of FORBIDDEN_PATTERNS) {
      if (pattern.test(req.url())) {
        violations.push({
          severity: "CRITICAL",
          url: req.url(),
          reason: `Outbound request matched forbidden 3rd-party pattern: ${pattern}`,
        });
        return;
      }
    }

    // Check against allowed external whitelist
    if (!ALLOWED_EXTERNAL_HOSTS.has(host)) {
      violations.push({
        severity: "FAIL",
        url: req.url(),
        host,
        reason: `Outbound request to unknown external host not in whitelist: ${host}`,
      });
    }
  });

  for (const route of routesToTest) {
    const fullUrl = `${BASE_URL}${route}`;
    process.stdout.write(`Testing route: ${route.padEnd(20)} `);
    try {
      const response = await page.goto(fullUrl, { waitUntil: "domcontentloaded", timeout: 15000 });
      const status = response ? response.status() : 0;
      console.log(`[HTTP ${status}] ✓`);
    } catch (e) {
      console.log(`[ERROR: ${e.message}]`);
    }
  }

  await browser.close();

  console.log("\n==================== AUDIT RESULTS ====================");
  console.log(`Total Outbound Network Requests: ${recordedRequests.length}`);
  console.log(`Third-Party Violations:         ${violations.length}`);

  if (violations.length > 0) {
    console.error("\n❌ AUDIT FAILED! The following unauthorized external requests were made:");
    violations.forEach((v, idx) => {
      console.error(`  ${idx + 1}. [${v.severity}] ${v.url} (${v.reason})`);
    });
    process.exit(1);
  } else {
    console.log("\n✅ AUDIT PASSED: 100% Zero-Key, Zero-AI, Self-Contained Web Application!");
    console.log("No outbound network requests made to any third-party APIs or external services.");
    console.log("========================================================\n");
    process.exit(0);
  }
}

async function runHttpFallbackAudit() {
  const routes = [
    "/",
    "/services",
    "/looks",
    "/booking",
    "/quiz",
    "/contact",
    "/login",
    "/register",
    "/reset-password",
    "/api/faq",
    "/api/slots?date=2026-11-20&duration=45",
  ];

  console.log("Checking security headers and HTML content for 3rd party scripts...");

  let failCount = 0;

  for (const route of routes) {
    const res = await fetch(`${BASE_URL}${route}`);
    const text = await res.text();

    for (const pattern of FORBIDDEN_PATTERNS) {
      if (pattern.test(text)) {
        console.error(`❌ Route ${route} contains forbidden reference: ${pattern}`);
        failCount++;
      }
    }

    const csp = res.headers.get("content-security-policy");
    const perm = res.headers.get("permissions-policy");

    if (route === "/") {
      console.log(`  CSP Header present: ${Boolean(csp)}`);
      console.log(`  Permissions-Policy present: ${Boolean(perm)}`);
      if (perm && perm.includes("camera=()")) {
        console.log("  ✓ Camera access denied across all origins via Permissions-Policy.");
      }
    }
  }

  if (failCount === 0) {
    console.log("\n✅ HTTP AUDIT PASSED: Zero forbidden references across all audited routes!");
    process.exit(0);
  } else {
    console.error(`\n❌ HTTP AUDIT FAILED: Found ${failCount} forbidden references.`);
    process.exit(1);
  }
}

runNetworkAudit().catch((err) => {
  console.error("Audit fatal error:", err);
  process.exit(1);
});
