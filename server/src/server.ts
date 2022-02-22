import { app } from './app';
import { initDb } from './datastore';

const initServer = async () => {
  await initDb();
  app.listen(process.env.PORT || 3000);
};

initServer();
