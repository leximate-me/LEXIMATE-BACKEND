export interface LogContext {
  correlationId?: string;
  method?: string;
  url?: string;
  ip?: string;
  userAgent?: string;
  userId?: string;
  [key: string]: any;
}

export interface LogMetadata {
  [key: string]: any;
}

export interface LogError extends Error {
  name: string;
  message: string;
  stack?: string;
}

export enum LogLevel {
  TRACE = 'trace',
  DEBUG = 'debug',
  INFO = 'info',
  WARN = 'warn',
  ERROR = 'error',
  FATAL = 'fatal',
}

export interface LoggerService {
  trace(message: string, metadata?: LogMetadata): void;
  debug(message: string, metadata?: LogMetadata): void;
  info(message: string, metadata?: LogMetadata): void;
  warn(message: string, metadata?: LogMetadata): void;
  error(
    message: string,
    error?: Error | LogError,
    metadata?: LogMetadata
  ): void;
  fatal(
    message: string,
    error?: Error | LogError,
    metadata?: LogMetadata
  ): void;
  child(context: LogContext): LoggerService;
}
