import express, { Request, Response } from "express";
import { Socket, Server, BroadcastOperator, Namespace, ServerOptions, RemoteSocket } from "socket.io";
import dotenv from "dotenv";
import socketioJwt from "socketio-jwt";
import { findDocOrCreate, updateDoc } from "./controllers/doc";
import connectDB from "./db";
import { loadUser, login, register } from "./controllers/user";
dotenv.config();

connectDB();

const app = express();
const httpServer = require("http").createServer(app);
const options: Partial<ServerOptions> = {
  cors: {
    origin: process.env?.URL?.toString(),
    methods: ["GET", "POST"],
  },
};
const io = require("socket.io")(httpServer, options);

export enum Events {
  DOCUMENT_CHANGE = "document-change",
  UPDATE_DOCUMENT = "update-document",
  SELECTION_CHANGE = "selection-change",
  UPDATE_SELECTION = "update-selection",
  FETCH_DOCUMENT = "fetch-document",
  FETCH_DOCUMENT_ERROR = "fetch-document:error",
  LOAD_DOCUMENT = "load-document",
  SAVE_DOCUMENT = "save-document",
}

export enum AuthEvents {
  REGISTER = "user:register",
  REGISTER_RESPONSE = "user:register:response",
  LOGIN = "user:login",
  LOGIN_RESPONSE = "user:login:response",
  LOGOUT = "user:logout",
  LOAD_USER = "user:load",
  SET_USER = "user:set",
}

export type SocketJWT = Socket & {
  decoded_token?: any;
};

io.use(
  socketioJwt.authorize({
    secret: process.env.JWT_SECRET!,
    timeout: 15000,
    auth_header_required: true,
    handshake: true,
  })
);

io.on("connection", (socket: SocketJWT) => {
  const { user } = socket.decoded_token;

  socket.on(Events.FETCH_DOCUMENT, async (docId: string) => {
    // TODO: check authorization
    const res = await findDocOrCreate(docId, user);
    if (!res.success) {
      // TODO: specify error responses
      // emit multi scenerios by types
      // socket.emit(Events.FETCH_DOCUMENT_ERROR, res.message);
      return;
    }

    socket.join(docId);

    socket.emit(Events.LOAD_DOCUMENT, res.doc);

    socket.on(Events.DOCUMENT_CHANGE, (delta) => {
      socket.broadcast.to(docId).emit(Events.UPDATE_DOCUMENT, delta);
    });

    socket.on(Events.SAVE_DOCUMENT, async (content) => {
      await updateDoc(docId, content);
    });
  });

  socket.on(Events.SELECTION_CHANGE, (range) => {
    socket.broadcast.emit(Events.UPDATE_SELECTION, range);
  });

  socket.on(AuthEvents.LOAD_USER, async () => {
    const res = await loadUser(user);
    // TODO: handle fail situation
    if (res.success) socket.emit(AuthEvents.SET_USER, res.user);
  });

  socket.on(AuthEvents.REGISTER, async (authInfo) => {
    const result = await register(authInfo);
    socket.emit(AuthEvents.REGISTER_RESPONSE, result);
    console.log(AuthEvents.REGISTER, result);
  });

  socket.on(AuthEvents.LOGIN, async (authInfo) => {
    const result = await login(authInfo);
    socket.emit(AuthEvents.LOGIN_RESPONSE, result);
  });
});

// app.use(express.urlencoded({ extended: false }));
// app.use(express.json());

app.get("/", (req: Request, res: Response) => {
  res.send("Express + TypeScript online-docs Server!");
});

// app.post("/auth/register", async (req: Request, res: Response) => {
//   const result = await register(req.body);
//   if (!result.success) res.statusCode = 400;
//   res.status(201).json(result);
// });

// app.post("/auth/login", async (req: Request, res: Response) => {
//   console.log(req.body);
//   const result = await login(req.body);
//   if (!result.success) res.statusCode = 400;
//   res.status(201).json(result);
// });

const PORT = process.env.PORT || 5000;

process.once("SIGUSR2", function () {
  process.kill(process.pid, "SIGUSR2");
});

process.on("SIGINT", function () {
  // this is only called on ctrl+c, not restart
  process.kill(process.pid, "SIGINT");
});

httpServer.listen(PORT, () => console.log(`Server listening on http://localhost:${PORT}`));
