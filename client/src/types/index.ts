import Quill from "quill";
import Delta from "quill-delta";
import { Socket } from "socket.io-client";

export const SOCKET_SERVER_URL =
  process.env?.NODE_ENV === "development" ? "http://localhost:5000" : "https://online-docs-server.herokuapp.com/";

export interface HandlerHooksProps {
  quill?: Quill;
  socket?: Socket;
  docId?: string;
}

export enum Events {
  DOCUMENT_CHANGE = "document-change",
  UPDATE_DOCUMENT = "update-document",
  SELECTION_CHANGE = "selection-change",
  UPDATE_SELECTION = "update-selection",
  FETCH_DOCUMENT = "fetch-document",
  LOAD_DOCUMENT = "load-document",
  SAVE_DOCUMENT = "save-document",
}

export enum DocumentPrivacy {
  PRIVATE = "private",
  PUBLIC = "public",
  UNLISTED = "unlisted",
}

export interface Document {
  _id: String;
  content: Delta;
  owner: String[];
  privacy: DocumentPrivacy;
  title: String;
  createdAt: String;
  updatedAt: String;
  __v?: Number;
}
