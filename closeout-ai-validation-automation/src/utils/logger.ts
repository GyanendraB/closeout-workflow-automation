export class Logger {
  static info(message: string): void {
    console.log(`[INFO] ${message}`); // Standard info log for consistent formatting.
  }

  static error(message: string): void {
    console.error(`[ERROR] ${message}`); // Standard error log for consistent formatting.
  }
}
