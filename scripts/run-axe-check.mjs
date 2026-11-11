import { chromium } from "playwright";
import { spawn } from "child_process";
import fs from "fs";
import { createRequire } from "module";

const require = createRequire(import.meta.url);

async function main() {
  const server = spawn("npx", ["next", "start", "-p", "3000"], {
    stdio: "inherit",
    shell: true,
  });

  await new Promise((r) => setTimeout(r, 3000));
  const browser = await chromium.launch();
  try {
    const page = await browser.newPage();
    await page.goto("http://localhost:3000", { waitUntil: "networkidle" });
    const axeSource = fs.readFileSync(require.resolve("axe-core/axe.min.js"), "utf8");
    await page.evaluate(axeSource);
    const results = await page.evaluate(async () => {
      // @ts-ignore
      return await axe.run({
        runOnly: {
          type: "tag",
          values: ["wcag2a", "wcag2aa"],
        },
      });
    });

    console.log(`Axe Violations: ${results.violations.length}`);
    for (const v of results.violations) {
      console.log(`- ${v.id}: ${v.description}`);
      for (const node of v.nodes) {
        console.log(`  Target:`, node.target);
        console.log(`  HTML:`, node.html);
      }
    }
  } finally {
    await browser.close();
    server.kill();
  }
}

main().catch(console.error);
