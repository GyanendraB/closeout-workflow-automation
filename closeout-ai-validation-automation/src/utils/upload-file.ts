import { mkdir, copyFile, appendFile } from "fs/promises";
import path from "path";
import { randomUUID } from "crypto";

export async function createUniqueUploadCopy(filePath: string): Promise<string> {
  const parsedFile = path.parse(filePath);
  const uploadDir = path.resolve(process.cwd(), "test-results", "upload-cache");
  const uniqueFileName = `${parsedFile.name}-${Date.now()}-${randomUUID()}${parsedFile.ext}`;
  const uniqueFilePath = path.join(uploadDir, uniqueFileName);
  const uniqueMarker = `\ncloseout-upload-marker:${Date.now()}-${randomUUID()}`;

  await mkdir(uploadDir, { recursive: true });
  await copyFile(filePath, uniqueFilePath);
  await appendFile(uniqueFilePath, uniqueMarker, "utf8");

  return uniqueFilePath;
}
