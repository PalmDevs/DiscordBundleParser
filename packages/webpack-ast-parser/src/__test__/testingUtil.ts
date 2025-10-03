import { readFileSync } from "node:fs";
import { join } from "node:path";

const __dirname = import.meta.dirname;

export function getFile(asset: string): string {
    return readFileSync(join(__dirname, asset), "utf-8");
}
