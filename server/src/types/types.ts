import { Socket } from 'socket.io';

export enum Events {
  DOCUMENT_CHANGE = 'document-change',
  UPDATE_DOCUMENT = 'update-document',
  SELECTION_CHANGE = 'selection-change',
  UPDATE_SELECTION = 'update-selection',
  FETCH_DOCUMENT = 'fetch-document',
  FETCH_DOCUMENT_ERROR = 'fetch-document:error',
  LOAD_DOCUMENT = 'load-document',
  SAVE_DOCUMENT = 'save-document',
}

export enum AuthEvents {
  REGISTER = 'user:register',
  REGISTER_RESPONSE = 'user:register:response',
  LOGIN = 'user:login',
  LOGIN_RESPONSE = 'user:login:response',
  LOGOUT = 'user:logout',
  LOAD_USER = 'user:load',
  SET_USER = 'user:set',
  USER_NOT_AUTH = 'user:not-authorized',
}

export type SocketJWT = Socket & {
  decoded_token?: any;
};
