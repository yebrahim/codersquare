import { Logtail } from '@logtail/node';
import { LogtailTransport } from '@logtail/winston';
import dotenv from 'dotenv';
import path from 'path';
import { createLogger, format, transports } from 'winston';
import * as Transport from 'winston-transport';

dotenv.config();

const { ENV, LOGTAIL_TOKEN } = process.env;
if (!LOGTAIL_TOKEN) {
  console.error('Missing LOGTAIL_TOKEN env var');
  process.exit(1);
}

const logtail = new Logtail(LOGTAIL_TOKEN);

const transportList: Transport[] = [
  new transports.Console({ format: format.simple() }),
  new transports.File({
    filename: path.join(__dirname, '..', 'process.log'),
    format: format.combine(format.timestamp(), format.json()),
  }),
];

if (ENV === 'production') {
  transportList.push(
    new LogtailTransport(logtail, {
      format: format.combine(format.timestamp(), format.json()),
    })
  );
}

export const LOGGER = createLogger({ transports: transportList });
