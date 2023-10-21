import express from 'express';
import logger from 'morgan';
import cors from 'cors';
import dotenv from 'dotenv';

import propertiesRouter from './routes/api/propertiesRouter.js';
import authRouter from './routes/api/authRouter.js';

// #########################################################

dotenv.config();
const app = express();

const formatsLogger = app.get('env') === 'development' ? 'dev' : 'short';

app.use(logger(formatsLogger));
app.use(cors());
app.use(express.json()); //  parses incoming requests with JSON payloads
app.use(express.static('public'));

app.use('/api/users', authRouter);
app.use('/api/properties', propertiesRouter);

app.use((req, res) => {
  res.status(404).json({ message: 'Not found' });
});

// Express error handler
app.use((err, req, res, next) => {
  const { status = 500, message = 'Server error' } = err;
  res.status(status).json({ message });
});

export default app;
