import path from "path"; // Path helpers for resolving absolute paths.

export function resolveFromRoot(...segments: string[]): string {
  return path.resolve(process.cwd(), ...segments); // Resolve segments from the current working directory.
}
