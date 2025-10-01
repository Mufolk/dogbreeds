export enum LogLevel {
  INFO = 'INFO',
  WARN = 'WARN',
  ERROR = 'ERROR',
  DEBUG = 'DEBUG',
}

export class Logger {
  private static log(level: LogLevel, message: string, ...args: any[]) {
    const timestamp = new Date().toISOString();
    console.log(`[${timestamp}] [${level}] - ${message}`, ...args);
  }

  static info(message: string, ...args: any[]) {
    this.log(LogLevel.INFO, message, ...args);
  }

  static warn(message: string, ...args: any[]) {
    this.log(LogLevel.WARN, message, ...args);
  }

  static error(message: string, ...args: any[]) {
    const timestamp = new Date().toISOString();
    console.error(`[${timestamp}] [ERROR] - ${message}`, ...args);
  }

  static debug(message: string, ...args: any[]) {
    if (process.env.NODE_ENV === 'development') {
      this.log(LogLevel.DEBUG, message, ...args);
    }
  }
}