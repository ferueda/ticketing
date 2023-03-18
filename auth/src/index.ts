import mongoose from 'mongoose';
import { Express } from 'express';
import app from './app';

const start = async (app: Express) => {
  if (!process.env.JWT_KEY) throw new Error('JWT_KEY is not defined');
  try {
    await mongoose.connect('mongodb://auth-mongo-srv:27017/auth');
    console.log('Connected to MongoDB');
  } catch (err) {
    console.error(err);
  }

  app.listen(3000, () => {
    console.log('Listening on port 3000');
  });
};

start(app);
