import pino from 'pino';
import pinoPretty from 'pino-pretty';

const stream = pinoPretty({
  colorize: true, // Coloriza la salida
  ignore: 'pid,hostname', // Ignora estos campos
  translateTime: 'SYS:standard', // Cambia el formato de la fecha
});

const logger = pino({ level: 'info' }, stream);

export { logger };
