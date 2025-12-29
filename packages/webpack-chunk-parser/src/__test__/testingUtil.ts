import { readFileSync } from "node:fs";
import { join } from "node:path";

export function getFile(path: string): string {
    return readFileSync(join(__dirname, path), "utf-8");
}