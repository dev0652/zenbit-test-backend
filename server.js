import mongoose from 'mongoose';
import { exit } from 'node:process';
import app from './app.js';

// ##################################

const { DB_HOST, PORT } = process.env;

mongoose
  .connect(DB_HOST)
  .then(() => {
    app.listen(PORT, () => {
      console.log(
        `Database connection successful. Server running on port ${PORT}`
      );
    });
  })
  .catch((error) => {
    console.log('Database connection failed. Error:', error.message);
    exit(1);
  });
