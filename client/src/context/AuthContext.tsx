import { createContext, FC, useContext, useEffect, useState } from "react";
import { Socket } from "socket.io-client";
import { io } from "socket.io-client";
import { AuthEvents, Document, SOCKET_SERVER_URL } from "types";
import { useDocContext } from "./DocumentContext";

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
  token?: string;
  user: User | null;
  socket?: Socket;
  register: (credentials: AuthUser) => void;
  login: (credentials: AuthUser) => void;
}

const AuthContext = createContext<AuthenticationContext>({
  token: undefined,
  user: null,
  socket: undefined,
  register: () => {},
  login: () => {},
});

export const useAuthContext = () => useContext(AuthContext);

const AuthContextProvider: FC = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string>();
  const [socket, setSocket] = useState<Socket>();

  useEffect(() => {
    const s = io(SOCKET_SERVER_URL);
    setSocket(s);
    console.log("connected");
    return () => {
      s.disconnect();
    };
  }, [setSocket]);

  const login = async (userInfo: AuthUser) => {
    socket?.emit(AuthEvents.LOGIN, userInfo);
    socket?.on(AuthEvents.LOGIN_RESPONSE, (res) => {
      // TODO:
      // load user?
      // login etc.
      // ui info/notification
      console.log({ res }, "client-LOGIN_RESPONSE");
      socket?.off(AuthEvents.LOGIN_RESPONSE);
    });
  };

  const register = async (userInfo: AuthUser) => {
    socket?.emit(AuthEvents.REGISTER, userInfo);
    socket?.on(AuthEvents.REGISTER_RESPONSE, (res) => {
      // TODO:
      // load user?
      // login etc.
      // ui info/notification
      console.log({ res }, "client-REGISTER_RESPONSE");
      socket?.off(AuthEvents.REGISTER_RESPONSE);
    });
  };

  const value = {
    token,
    user,
    socket,
    register,
    login,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContextProvider;
