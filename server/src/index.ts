import dotenv from 'dotenv';

import { createServer } from './server';

(async () => {
  // read .env file
  dotenv.config();

  const { ENV, PORT, DB_PATH } = process.env;
  if (!ENV || !PORT || !DB_PATH) {
    console.error('Missing some required env vars');
    process.exit(1);
  }

  const server = await createServer(DB_PATH);
  server.listen(PORT, () => console.log(`Listening on port ${PORT} in ${ENV} environment`));
})();
