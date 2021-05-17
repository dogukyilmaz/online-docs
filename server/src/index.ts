import express, { Request, Response } from "express";
import { Socket, ServerOptions, Namespace } from "socket.io";
import dotenv from "dotenv";
import socketioJwt, { authorize } from "socketio-jwt";
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
  USER_NOT_AUTH = "user:not-authorized",
}

export type SocketJWT = Socket & {
  decoded_token?: any;
};

const authNs: Namespace = io.of("/auth");
const userNs: Namespace = io.of("/user");
const docNs: Namespace = io.of("/doc");

docNs.use(
  socketioJwt.authorize({
    secret: process.env.JWT_SECRET!,
    timeout: 15000,
    auth_header_required: true,
    handshake: true,
  }) as any
);

authNs.use(
  socketioJwt.authorize({
    secret: process.env.JWT_SECRET!,
    timeout: 15000,
    auth_header_required: true,
    handshake: true,
  }) as any
);

// authNs.use((socket: SocketJWT, next: any) => {
//   console.log("error");
//   const err: any = new Error("not authorized");
//   err.data = { content: "Please retry later" }; // additional details
//   next(err);
// });

// io.on("connection", (s: Socket) => {
//   console.log("connectted sth");

//   s.on(AuthEvents.LOAD_USER, () => {
//     console.log("load user event");
//   });
// });

userNs.on("connection", (socket: SocketJWT) => {
  console.log("userNs.on");
  const jwt = socket?.decoded_token || "";

  console.log(jwt, "jwt");
  if (!jwt) return socket.emit(AuthEvents.USER_NOT_AUTH);
  // const user = "erss";

  console.log("userNs", jwt.user);
  console.log(socket.handshake.headers);

  socket.on(AuthEvents.LOAD_USER, async () => {
    console.log("LOAD_USER");
    if (!jwt) return;
    console.log("token");
    const res = await loadUser(jwt.user);
    // TODO: handle fail situation
    if (res.success) socket.emit(AuthEvents.SET_USER, res.user);
  });
});

authNs.on("connection", (socket: SocketJWT) => {
  console.log("authNs");

  socket.on(AuthEvents.REGISTER, async (authInfo) => {
    console.log("REGISTER");
    const result = await register(authInfo);
    socket.emit(AuthEvents.REGISTER_RESPONSE, result);
    console.log(AuthEvents.REGISTER, result);
  });

  socket.on(AuthEvents.LOGIN, async (authInfo) => {
    console.log("LOGIN", authInfo);
    const result = await login(authInfo);
    socket.emit(AuthEvents.LOGIN_RESPONSE, result);
  });
});

docNs.on("connection", (socket: SocketJWT) => {
  console.log("docNs");
  const { user } = socket.decoded_token;

  socket.on(Events.FETCH_DOCUMENT, async (docId: string) => {
    // TODO: check authorization
    const res = await findDocOrCreate(docId, user);
    if (!res.success) {
      // TODO: specify error responses
      // emit multi scenerios by types
      // socket.emit(Events.FETCH_DOCUMENT_ERROR, res.message);
      console.log("error");
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

httpServer.listen(PORT, () => console.log(`Server listening on http://localhost:${PORT}`));
