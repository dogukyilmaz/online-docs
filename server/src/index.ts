import express from 'express';
import { ServerOptions, Server } from 'socket.io';
import dotenv from 'dotenv';
import connectDB from './db';

import authRoute from './routes/rest/auth';
import defaultRoute from './routes/rest';

import authSocket from './routes/socket/auth';
import docSocket from './routes/socket/doc';
import socketioJwt from 'socketio-jwt';
import http from 'http';
import { SocketJWT } from './types/types';

dotenv.config();
connectDB();

const app = express();
const httpServer = http.createServer(app);
// const options: Partial<ServerOptions> = {
//   cors: {
//     origin: process.env?.URL?.toString(),
//     methods: ['GET', 'POST'],
//   },
// };
const io = new Server(httpServer);
// const io = require('socket.io')(httpServer, options);

io.use(
  socketioJwt.authorize({
    secret: process.env.JWT_SECRET || '',
    handshake: true,
  }) as any
);

io.on('connection', (socket: any) => {
  console.log('hello!', socket.decoded_token.name);
});

// const authNs: Namespace = io.of('/auth');
io.of('/auth').on('connection', authSocket);
io.of('/doc').on('connection', docSocket);

// app.use(express.urlencoded({ extended: false }));
// app.use(express.json());
app.use('/', defaultRoute);
app.use('/auth', authRoute);

const PORT = process.env.PORT || 5000;

httpServer.listen(PORT, () => console.log(`Server listening on http://localhost:${PORT}`));
