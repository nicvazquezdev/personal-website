import { execSync } from "child_process";

export function getLastCommitDate(): string {
  try {
    const date = execSync("git log -1 --format=%cI", { encoding: "utf-8" }).trim();
    return date;
  } catch {
    return new Date().toISOString();
  }
}
