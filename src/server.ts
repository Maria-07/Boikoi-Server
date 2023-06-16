import mongoose from 'mongoose';
import config from './config';
import { Server } from 'http';
import app from './app';

const uri = config.database_url as string;
console.log(uri);

let server: Server;

async function bootstrap() {
  try {
    await mongoose.connect(uri);
    console.log('🛢 database connection successful✨');

    server = app.listen(config.port, () => {
      console.log(`Application listening on port ${config.port}`);
    });
  } catch (err) {
    console.log('Failed to connect Database');
  }
}

bootstrap();

process.on('SIGTERM', () => {
  console.log('Sigterm is received');
  if (server) {
    server.close();
  }
});
