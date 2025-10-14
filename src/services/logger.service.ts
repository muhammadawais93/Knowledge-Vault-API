import pino, { Logger, LoggerOptions } from 'pino';

export default class LoggerService {
  private static instance: Logger;

  private constructor() {}

  public static getLogger(): Logger {
    if (!LoggerService.instance) {
      const options: LoggerOptions = {
        level: process.env.LOG_LEVEL || 'info',
      };

      const isDev = process.env.NODE_ENV !== 'production';

      if (isDev) {
        options.transport = {
          target: 'pino-pretty',
          options: {
            colorize: true,
            translateTime: 'SYS:standard',
            ignore: 'pid,hostname',
          },
        };
      }

      LoggerService.instance = pino(options);
    }

    return LoggerService.instance;
  }
}
