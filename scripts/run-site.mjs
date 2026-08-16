import { spawnSync } from "node:child_process"
import path from "node:path"
import { fileURLToPath } from "node:url"

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..")
const [profile = "main", ...extraArgs] = process.argv.slice(2)

if (!new Set(["main", "acoustic"]).has(profile)) {
  console.error(`Unknown site profile: ${profile}`)
  process.exit(2)
}

if (profile === "acoustic") {
  const buildReader = spawnSync(process.execPath, ["scripts/build-excalidraw-reader.mjs"], {
    cwd: repoRoot,
    stdio: "inherit",
  })
  if (buildReader.status !== 0) process.exit(buildReader.status ?? 1)
}

const quartzArgs = ["quartz/bootstrap-cli.mjs", "build"]
if (profile === "acoustic") {
  quartzArgs.push("-d", "sites/acoustic/content", "-o", "public-acoustic")
}
quartzArgs.push(...extraArgs)

const result = spawnSync(process.execPath, quartzArgs, {
  cwd: repoRoot,
  stdio: "inherit",
  env: {
    ...process.env,
    QUARTZ_SITE: profile,
  },
})

process.exit(result.status ?? 1)
