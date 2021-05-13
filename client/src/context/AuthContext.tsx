import { createContext, FC, useContext, useEffect, useState } from "react";
import { Socket } from "socket.io-client";
import { io } from "socket.io-client";
import { AuthEvents, Document, SOCKET_SERVER_URL } from "types";
import { useDocContext } from "./DocumentContext";

export interface AuthUser {
  name?: string;
  email: string;
  password: string;
}

export interface AuthenticationContext {
  token?: string;
  socket?: Socket;
  register: (credentials: AuthUser) => void;
  login: (credentials: AuthUser) => void;
}

const AuthContext = createContext<AuthenticationContext>({
  token: undefined,
  socket: undefined,
  register: () => {},
  login: () => {},
});

export const useAuthContext = () => useContext(AuthContext);

const AuthContextProvider: FC = ({ children }) => {
  const [token, setToken] = useState<string>();
  const [socket, setSocket] = useState<Socket>();

  useEffect(() => {
    const s = io(`${SOCKET_SERVER_URL}/auth`);

    setSocket(s);
    console.log("connected");
    return () => {
      s.disconnect();
    };
  }, [token, setSocket]);

  useEffect(() => {
    if (!token) {
      const localToken = localStorage.getItem("online-docs-token");
      if (localToken) setToken(localToken);
    }
  }, []);

  const login = async (userInfo: AuthUser) => {
    socket?.emit(AuthEvents.LOGIN, userInfo);
    socket?.on(AuthEvents.LOGIN_RESPONSE, (res) => {
      console.log({ res }, "login auth context");
      // TODO:
      // load user?
      // login etc.
      // ui info/notification
      setToken(res.token);
      localStorage.setItem("online-docs-token", res.token);
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
      socket?.off(AuthEvents.REGISTER_RESPONSE);
    });
  };

  const value = {
    token,
    socket,
    register,
    login,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContextProvider;
