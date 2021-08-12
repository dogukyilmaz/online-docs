import express from 'express';
import { ServerOptions } from 'socket.io';
import dotenv from 'dotenv';
import connectDB from './db';

import authRoute from './routes/rest/auth';
import defaultRoute from './routes/rest';

import userSocket from './routes/socket/user';
import authSocket from './routes/socket/auth';
import docSocket from './routes/socket/doc';

dotenv.config();
connectDB();

const app = express();
const httpServer = require('http').createServer(app);
const options: Partial<ServerOptions> = {
  cors: {
    origin: process.env?.URL?.toString(),
    methods: ['GET', 'POST'],
  },
};
const io = require('socket.io')(httpServer, options);

// const authNs: Namespace = io.of('/auth');
io.of('/auth').on('connection', userSocket);
io.of('/user').on('connection', authSocket);
io.of('/doc').on('connection', docSocket);

// app.use(express.urlencoded({ extended: false }));
// app.use(express.json());
app.use('/', defaultRoute);
app.use('/auth', authRoute);

const PORT = process.env.PORT || 5000;

httpServer.listen(PORT, () => console.log(`Server listening on http://localhost:${PORT}`));
