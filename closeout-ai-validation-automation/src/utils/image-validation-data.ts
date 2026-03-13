import { readdir } from "fs/promises";
import path from "path";

const SUPPORTED_IMAGE_EXTENSIONS = new Set([".jpg", ".jpeg", ".png", ".webp"]);

export async function getImageFiles(imagesDir: string): Promise<Array<{
  fileName: string;
  filePath: string;
}>> {
  const entries = await readdir(imagesDir, { withFileTypes: true });

  return entries
    .filter((entry) => entry.isFile())
    .filter((entry) => SUPPORTED_IMAGE_EXTENSIONS.has(path.extname(entry.name).toLowerCase()))
    .map((entry) => ({
      fileName: entry.name,
      filePath: path.join(imagesDir, entry.name)
    }))
    .sort((left, right) => left.fileName.localeCompare(right.fileName));
}
