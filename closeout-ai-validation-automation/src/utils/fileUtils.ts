import path from "path";

export function resolveFromRoot(...segments: string[]): string {
  return path.resolve(process.cwd(), ...segments);
}
