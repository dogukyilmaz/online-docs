import { createContext, FC, useContext, useEffect, useState } from "react";
import { Socket } from "socket.io-client";
import { io } from "socket.io-client";
import { UserEvents, Document, SOCKET_SERVER_URL } from "types";
import { useAuthContext } from "./AuthContext";

export interface User {
  id: string;
  name: string;
  email: string;
  createdAt: string;
  docs?: Document[];
}

export interface UsrContext {
  user: User | null;
  socket?: Socket;
  loadUser: () => void;
  setUser: (user: User | null) => void;
}

const UserContext = createContext<UsrContext>({
  user: null,
  socket: undefined,
  loadUser: () => {},
  setUser: () => {},
});

export const useUserContext = () => useContext(UserContext);

const UserContextProvider: FC = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [socket, setSocket] = useState<Socket>();
  const { token } = useAuthContext();

  useEffect(() => {
    if (!token) return;
    const s = io(`${SOCKET_SERVER_URL}`, {
      extraHeaders: { Userorization: `Bearer ${token}` },
    });

    setSocket(s);
    console.log("connected");
    return () => {
      s.disconnect();
    };
  }, [token, setSocket]);

  const loadUser = async () => {
    console.log("load user func");
    if (!token) return;
    console.log("TOKEN VAR");

    socket?.emit(UserEvents.LOAD_USER);
    socket?.once(UserEvents.SET_USER, (user: User) => {
      console.log("SET USER", user);
      setUser(user);
    });
  };

  const value = {
    user,
    socket,
    loadUser,
    setUser,
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};

export default UserContextProvider;
