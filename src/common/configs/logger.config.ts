import pino from 'pino';
import pinoPretty from 'pino-pretty';

const stream = pinoPretty({
  colorize: true,
  ignore: 'pid,hostname',
  translateTime: 'SYS:yyyy-mm-dd HH:MM:ss',
  levelFirst: true,
  messageFormat: '{levelLabel} - {time} - {msg}', // <--- Personalización sencilla
  errorLikeObjectKeys: ['err', 'error'],
  singleLine: false,
});

const logger = pino(
  {
    level: 'info',
    base: null,
  },
  stream
);

export { logger };
