import superset from 'supertest';

import { createServer } from '../server';

let client: superset.SuperTest<superset.Test>;

export async function getTestServer() {
  if (!client) {
    const server = await createServer(':memory:', false);
    client = superset(server);
  }

  return client;
}
