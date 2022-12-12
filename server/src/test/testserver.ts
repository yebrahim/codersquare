import { config } from 'dotenv';
import path from 'path';
import superset from 'supertest';

import { createServer } from '../server';

let client: superset.SuperTest<superset.Test>;

export async function getTestServer() {
  if (!client) {
    config({ path: path.join(__dirname, '/.env.test') });
    const server = await createServer(false);
    client = superset(server);
  }

  return client;
}
