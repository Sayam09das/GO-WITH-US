import multer from "multer";
import { AppError } from "./errors.js";

const MAX_FILE_BYTES = 12 * 1024 * 1024;

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: MAX_FILE_BYTES, files: 1 },
});

export const uploadSingle = upload.single("file");

export function assertUploadedFile(file: Express.Multer.File | undefined): Express.Multer.File {
  if (!file) {
    throw new AppError(400, "VALIDATION_ERROR", "A file is required.");
  }

  return file;
}

const ALLOWED_DOCUMENT_MIME = new Set(["application/pdf", "image/jpeg", "image/png", "image/webp"]);

const ALLOWED_AVATAR_MIME = new Set(["image/jpeg", "image/png", "image/webp"]);

export function assertDocumentMime(mimeType: string): void {
  if (!ALLOWED_DOCUMENT_MIME.has(mimeType)) {
    throw new AppError(400, "VALIDATION_ERROR", "Only PDF, JPG, PNG, or WebP files are allowed.");
  }
}

export function assertAvatarMime(mimeType: string): void {
  if (!ALLOWED_AVATAR_MIME.has(mimeType)) {
    throw new AppError(400, "VALIDATION_ERROR", "Only JPG, PNG, or WebP images are allowed.");
  }
}

export function formatFileSize(bytes: number): string {
  if (bytes < 1024) {
    return `${bytes} B`;
  }
  if (bytes < 1024 * 1024) {
    return `${(bytes / 1024).toFixed(1)} KB`;
  }
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}
