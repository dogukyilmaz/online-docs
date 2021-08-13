import { Socket } from 'socket.io-client';

export interface User {
  id: string;
  name: string;
  email: string;
  createdAt: string;
  docs?: Document[];
}

export interface AuthUser {
  name?: string;
  email: string;
  password: string;
}

export interface AuthenticationContext {
  token?: string | null;
  socket?: Socket;
  user: User | null;
  register: (credentials: AuthUser) => void;
  login: (credentials: AuthUser) => void;
  loadUser: () => void;
}
