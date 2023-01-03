import dotenv from 'dotenv';

import { createServer } from './server';

(async () => {
  // read .env file
  dotenv.config();

  const { ENV, PORT } = process.env;
  if (!ENV || !PORT) {
    console.error('Missing some required env vars');
    process.exit(1);
  }

  const server = await createServer();
  server.listen(PORT, () => console.log(`Listening on port ${PORT} in ${ENV} environment`));
})();
