import Delta from "quill-delta";

export const SOCKET_SERVER_URL =
  process.env?.NODE_ENV === "development" ? "http://localhost:5000" : "https://online-docs-server.herokuapp.com";

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
}

export enum UserEvents {
  LOAD_USER = "user:load",
  SET_USER = "user:set",
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
