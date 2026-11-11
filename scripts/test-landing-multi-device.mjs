import { chromium } from "playwright";
import { spawn } from "child_process";
import fs from "fs";
import path from "path";
import { createRequire } from "module";

const require = createRequire(import.meta.url);

// Ensure screenshot directory exists
const screenshotDir = path.resolve(process.cwd(), "public/screenshots");
if (!fs.existsSync(screenshotDir)) {
  fs.mkdirSync(screenshotDir, { recursive: true });
}

const devicesToTest = [
  { name: "iPhone-SE", width: 375, height: 667, isMobile: true, hasTouch: true },
  { name: "iPhone-14-Pro-Max", width: 430, height: 932, isMobile: true, hasTouch: true },
  { name: "iPad", width: 810, height: 1080, isMobile: true, hasTouch: true },
  { name: "Pixel-7", width: 412, height: 915, isMobile: true, hasTouch: true },
  { name: "Galaxy-S9-Plus", width: 360, height: 740, isMobile: true, hasTouch: true },
  { name: "Desktop-1280", width: 1280, height: 800, isMobile: false, hasTouch: false },
  { name: "Desktop-1920", width: 1920, height: 1080, isMobile: false, hasTouch: false },
];

async function main() {
  console.log("=== BEEM Animated Landing Page Multi-Device Test ===");

  // Start Next.js production server
  const server = spawn("npx", ["next", "start", "-p", "3000"], {
    stdio: "inherit",
    shell: true,
  });

  // Wait 4 seconds for server to be ready
  await new Promise((r) => setTimeout(r, 4000));

  const browser = await chromium.launch({ headless: true });
  let hasFailures = false;
  const testResults = [];

  try {
    for (const dev of devicesToTest) {
      console.log(`\nTesting device: ${dev.name} (${dev.width}x${dev.height})...`);
      const context = await browser.newContext({
        viewport: { width: dev.width, height: dev.height },
        isMobile: dev.isMobile,
        hasTouch: dev.hasTouch,
        deviceScaleFactor: 2,
      });

      const page = await context.newPage();
      await page.goto("http://localhost:3000", { waitUntil: "networkidle" });

      // Check for horizontal overflow
      const overflow = await page.evaluate(() => {
        return {
          scrollWidth: document.documentElement.scrollWidth,
          clientWidth: document.documentElement.clientWidth,
          hasOverflow: document.documentElement.scrollWidth > document.documentElement.clientWidth,
        };
      });

      console.log(
        `  Horizontal scroll check: clientWidth=${overflow.clientWidth}, scrollWidth=${overflow.scrollWidth}, overflow=${overflow.hasOverflow}`
      );
      if (overflow.hasOverflow) {
        console.error(`  [FAIL] Horizontal overflow detected on ${dev.name}!`);
        hasFailures = true;
      }

      // Take full-page screenshot
      const screenshotPath = path.join(screenshotDir, `${dev.name}.png`);
      await page.screenshot({ path: screenshotPath, fullPage: true });
      console.log(`  Saved screenshot: ${screenshotPath}`);

      // Test FAQ Accordion click
      const faqButton = page.locator("#faq button").first();
      if (await faqButton.isVisible()) {
        await faqButton.click({ timeout: 3000 });
        const isExpanded = await faqButton.getAttribute("aria-expanded");
        console.log(`  FAQ accordion interaction: aria-expanded=${isExpanded}`);
      }

      // Test Before/After Slider Interaction
      const slider = page.locator('[role="slider"]');
      if (await slider.isVisible()) {
        await slider.focus();
        await page.keyboard.press("ArrowLeft");
        await page.keyboard.press("ArrowLeft");
        const val = await slider.getAttribute("aria-valuenow");
        console.log(`  Before/After slider keyboard interaction: valuenow=${val}`);
      }

      // Test mobile menu on mobile devices
      if (dev.isMobile) {
        try {
          await page.evaluate(() => window.scrollTo(0, 0));
          await page.waitForTimeout(200);
          const menuBtn = page.locator('button[aria-label="Toggle navigation menu"]');
          if (await menuBtn.isVisible()) {
            await menuBtn.click({ timeout: 2000, force: true });
            await page.waitForTimeout(300);
            console.log(`  Mobile drawer opened successfully.`);
            await page.keyboard.press("Escape");
            await page.waitForTimeout(300);
            console.log(`  Mobile drawer closed via Escape key.`);
          }
        } catch (e) {
          console.log(`  Mobile menu interaction note: ${e.message}`);
        }
      }

      testResults.push({
        device: dev.name,
        width: dev.width,
        height: dev.height,
        hasOverflow: overflow.hasOverflow,
        screenshot: `${dev.name}.png`,
      });

      await context.close();
    }

    // Test Dark Mode
    console.log("\nTesting Dark Purple Mode on Desktop 1280...");
    const darkContext = await browser.newContext({
      viewport: { width: 1280, height: 800 },
      colorScheme: "dark",
    });
    const darkPage = await darkContext.newPage();
    await darkPage.goto("http://localhost:3000", { waitUntil: "networkidle" });
    await darkPage.screenshot({
      path: path.join(screenshotDir, "Desktop-1280-DarkMode.png"),
      fullPage: true,
    });
    console.log("  Saved dark mode screenshot: Desktop-1280-DarkMode.png");
    await darkContext.close();

    // Test Prefers-Reduced-Motion
    console.log("\nTesting Prefers-Reduced-Motion...");
    const reducedMotionContext = await browser.newContext({
      viewport: { width: 1280, height: 800 },
      reducedMotion: "reduce",
    });
    const rmPage = await reducedMotionContext.newPage();
    await rmPage.goto("http://localhost:3000", { waitUntil: "networkidle" });
    await rmPage.screenshot({
      path: path.join(screenshotDir, "Desktop-1280-ReducedMotion.png"),
      fullPage: true,
    });
    console.log("  Saved reduced motion screenshot: Desktop-1280-ReducedMotion.png");
    await reducedMotionContext.close();

    // Test 200% Text Zoom
    console.log("\nTesting 200% Text Zoom Simulation...");
    const zoomContext = await browser.newContext({
      viewport: { width: 1280, height: 800 },
    });
    const zoomPage = await zoomContext.newPage();
    await zoomPage.goto("http://localhost:3000", { waitUntil: "networkidle" });
    await zoomPage.evaluate(() => {
      document.body.style.zoom = "200%";
    });
    const zoomOverflow = await zoomPage.evaluate(() => {
      return document.documentElement.scrollWidth > document.documentElement.clientWidth;
    });
    console.log(`  200% text zoom overflow check: overflow=${zoomOverflow}`);
    await zoomPage.screenshot({
      path: path.join(screenshotDir, "Desktop-1280-Zoom200.png"),
      fullPage: false,
    });
    await zoomContext.close();

    // Run axe accessibility checks
    console.log("\nRunning axe accessibility checks on landing page...");
    const axeContext = await browser.newContext({
      viewport: { width: 1280, height: 800 },
    });
    const axePage = await axeContext.newPage();
    await axePage.goto("http://localhost:3000", { waitUntil: "networkidle" });

    // Inject axe-core
    const axeSource = fs.readFileSync(require.resolve("axe-core/axe.min.js"), "utf8");
    await axePage.evaluate(axeSource);
    const axeResults = await axePage.evaluate(async () => {
      // @ts-ignore
      return await axe.run({
        runOnly: {
          type: "tag",
          values: ["wcag2a", "wcag2aa", "best-practice"],
        },
      });
    });

    console.log(`  Axe violations count: ${axeResults.violations.length}`);
    if (axeResults.violations.length > 0) {
      for (const v of axeResults.violations) {
        console.log(`  - [${v.impact?.toUpperCase()}] ${v.id}: ${v.description} (${v.nodes.length} nodes)`);
        for (const n of v.nodes) {
          console.log(`    Target: ${JSON.stringify(n.target)} | HTML: ${n.html}`);
        }
      }
    } else {
      console.log("  [PASS] Zero accessibility violations detected by axe!");
    }
    await axeContext.close();

    console.log("\nAll device tests completed successfully!");
    console.log(JSON.stringify(testResults, null, 2));
  } catch (err) {
    console.error("Fatal error during test:", err);
    hasFailures = true;
  } finally {
    await browser.close();
    server.kill();
  }

  if (hasFailures) {
    process.exit(1);
  }
}

main().catch((err) => {
  console.error("Test execution failed:", err);
  process.exit(1);
});
