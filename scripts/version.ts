/**
 * Pre-build script: stamps src/version.ts with the current git short hash
 * and build date. Run automatically via `bun run build`.
 */
import { execSync } from "child_process";
import { writeFileSync } from "fs";

const hash = execSync("git rev-parse --short HEAD").toString().trim();
const date = new Date().toISOString().split("T")[0];
const version = `${hash} (${date})`;

writeFileSync(
  "src/version.ts",
  `/**\n * Stamped at build time — do not edit manually.\n * Run \`bun run build\` to update.\n */\nexport const VERSION = "${version}";\n`
);

console.log(`[version] ${version}`);
