import Quill from "quill";
import { Socket } from "socket.io-client";

export const SOCKET_SERVER_URL = "http://localhost:5000";

export interface HandlerHooksProps {
  quill?: Quill;
  socket?: Socket;
}

export enum Events {
  DOCUMENT_CHANGE = "document-change",
  UPDATE_DOCUMENT = "update-document",
  SELECTION_CHANGE = "selection-change",
  UPDATE_SELECTION = "update-selection",
}
