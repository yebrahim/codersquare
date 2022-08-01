import path from 'path';

import { createServer } from './server';

(async () => {
  const dbPath = path.join(__dirname, 'codersquare.sqlite');
  const server = await createServer(dbPath);

  const { ENV, PORT } = process.env;
  server.listen(PORT, () => console.log(`Listening on port ${PORT} in ${ENV} environment`));
})();
