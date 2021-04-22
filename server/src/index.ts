import express, { Request, Response } from "express";
import { Socket, Server, BroadcastOperator, Namespace, ServerOptions, RemoteSocket } from "socket.io";

const app = express();
const httpServer = require("http").createServer(app);
const URL = "http://localhost:3000";
const options: Partial<ServerOptions> = {
  cors: {
    origin: URL,
    methods: ["GET", "POST"],
  },
};
const io: Server = require("socket.io")(httpServer, options);

enum Events {
  DOCUMENT_CHANGE = "document-change",
  UPDATE_DOCUMENT = "update-document",
}

io.on("connection", (socket: Socket) => {
  socket.on(Events.DOCUMENT_CHANGE, (delta) => {
    socket.broadcast.emit(Events.UPDATE_DOCUMENT, delta);
  });
});

app.get("/", (req: Request, res: Response) => {
  res.send("Express + TypeScript online-docs Server!");
});

const PORT = process.env.PORT || 5000;

httpServer.listen(PORT, () => console.log(`Server listening on http://localhost:${PORT}`));
