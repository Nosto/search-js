#!/usr/bin/env node
import { execSync } from "child_process"

// Only run patch-package when installing in the repository itself,
// not when this package is installed as a dependency in another project.
// INIT_CWD is set by npm to the directory where 'npm install' was initiated.
// In the repo, it equals process.cwd(). When installed as a dep, it doesn't.
if (process.env.INIT_CWD === process.cwd()) {
  try {
    execSync("patch-package", { stdio: "inherit" })
  } catch (error) {
    console.warn("postinstall patch-package failed:", error && error.message)
  }
}
