import pino from 'pino';
import pinoPretty from 'pino-pretty';

const stream = pinoPretty({
  colorize: true, // Coloriza la salida
  ignore: 'pid,hostname', // Ignora estos campos
  translateTime: 'SYS:HH:MM:ss', // Cambia el formato de la fecha
  levelFirst: true, // Muestra el nivel del log primero
  messageFormat: false, // Muestra el mensaje en un formato más legible
});

const logger = pino({ level: 'info' }, stream);

export { logger };
