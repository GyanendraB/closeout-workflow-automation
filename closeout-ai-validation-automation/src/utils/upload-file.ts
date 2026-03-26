import { mkdir, copyFile, appendFile } from "fs/promises"; // File system helpers for creating and modifying files.
import path from "path"; // Path utilities for cross-platform file handling.
import { randomUUID } from "crypto"; // UUID generator for unique file names and markers.

export async function createUniqueUploadCopy(filePath: string): Promise<string> {
  const parsedFile = path.parse(filePath); // Split the source file into name, extension, and directory.
  const uploadDir = path.resolve(process.cwd(), "test-results", "upload-cache"); // Store generated copies in a predictable artifacts folder.
  const uniqueFileName = `${parsedFile.name}-${Date.now()}-${randomUUID()}${parsedFile.ext}`; // Build a unique filename to avoid collisions.
  const uniqueFilePath = path.join(uploadDir, uniqueFileName); // Join folder and filename into a full path.
  // Add a small unique marker so repeated uploads are treated as new files by the app.
  const uniqueMarker = `\ncloseout-upload-marker:${Date.now()}-${randomUUID()}`; // Marker string appended to the file.

  await mkdir(uploadDir, { recursive: true }); // Ensure the output directory exists.
  await copyFile(filePath, uniqueFilePath); // Copy the original file to the unique path.
  await appendFile(uniqueFilePath, uniqueMarker, "utf8"); // Append a marker so the file content is unique.

  return uniqueFilePath; // Return the path that should be uploaded by the test.
}
