import { readdir } from "fs/promises"; // Async directory reader for collecting image files.
import path from "path"; // Path helpers for file extension checks and joins.

const SUPPORTED_IMAGE_EXTENSIONS = new Set([".jpg", ".jpeg", ".png", ".webp"]); // Allowed image types for validation.

export async function getImageFiles(imagesDir: string): Promise<Array<{
  fileName: string;
  filePath: string;
}>> {
  const entries = await readdir(imagesDir, { withFileTypes: true }); // Read folder entries with file type metadata.

  return entries
    .filter((entry) => entry.isFile()) // Keep only files, ignore subfolders.
    .filter((entry) => SUPPORTED_IMAGE_EXTENSIONS.has(path.extname(entry.name).toLowerCase())) // Keep only supported image types.
    .map((entry) => ({
      fileName: entry.name, // Preserve original filename for reporting.
      filePath: path.join(imagesDir, entry.name) // Build full path for upload.
    }))
    .sort((left, right) => left.fileName.localeCompare(right.fileName)); // Sort deterministically by name.
}
