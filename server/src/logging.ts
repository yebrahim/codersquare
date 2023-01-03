import fs from 'fs';
import path from 'path';
import { pino } from 'pino';
import pretty from 'pino-pretty';

const streams: { write: any }[] = [
  process.env.ENV === 'production' ? process.stdout : pretty(),
  fs.createWriteStream(path.join(__dirname, '..', 'process.log')),
];

export const LOGGER = pino(
  {
    redact: ['body.password'],
    formatters: {
      bindings: () => ({}),
    },
  },
  pino.multistream(streams)
);
