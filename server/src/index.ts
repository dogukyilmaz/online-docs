import express, { Request, Response } from "express";
import { Socket, Server, BroadcastOperator, Namespace, ServerOptions, RemoteSocket } from "socket.io";
import dotenv from "dotenv";
import { findDocOrCreate, updateDoc } from "./controllers/doc";
import connectDB from "./db";
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
const io: Server = require("socket.io")(httpServer, options);

export enum Events {
  DOCUMENT_CHANGE = "document-change",
  UPDATE_DOCUMENT = "update-document",
  SELECTION_CHANGE = "selection-change",
  UPDATE_SELECTION = "update-selection",
  FETCH_DOCUMENT = "fetch-document",
  LOAD_DOCUMENT = "load-document",
  SAVE_DOCUMENT = "save-document",
}

const TEMP_DATA = "temp data!";

io.on("connection", (socket: Socket) => {
  socket.on(Events.FETCH_DOCUMENT, async (docId: string) => {
    // TODO: check authorization
    const res = await findDocOrCreate(docId);
    if (!res.success) return;

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

app.get("/", (req: Request, res: Response) => {
  res.send("Express + TypeScript online-docs Server!");
});

const PORT = process.env.PORT || 5000;

httpServer.listen(PORT, () => console.log(`Server listening on http://localhost:${PORT}`));
