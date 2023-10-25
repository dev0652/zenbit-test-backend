import mongoose from 'mongoose';
// import dotenv from 'dotenv';
import 'dotenv/config';
import { exit } from 'node:process';
import app from './app.js';

// ##################################

// dotenv.config();
const { DB_HOST, PORT } = process.env;
mongoose.set('strictQuery', false);

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
