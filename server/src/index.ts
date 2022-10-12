import dotenv from 'dotenv';
import path from 'path';

import { createServer } from './server';

(async () => {
  // read .env file
  dotenv.config({ path: path.join(__dirname, '.env') });

  const dbPath = path.join(__dirname, 'datastore', 'sql', 'codersquare.sqlite');
  const server = await createServer(dbPath);

  const { ENV, PORT } = process.env;
  server.listen(PORT, () => console.log(`Listening on port ${PORT} in ${ENV} environment`));
})();
