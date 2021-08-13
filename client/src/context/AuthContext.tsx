import { createContext, FC, useContext, useEffect, useState } from 'react';
import { Socket } from 'socket.io-client';
import { io } from 'socket.io-client';
import { AuthEvents, SOCKET_SERVER_URL } from 'types';
import { AuthenticationContext, AuthUser, User } from 'types/context';

const AuthContext = createContext<AuthenticationContext>({
  token: undefined,
  socket: undefined,
  user: null,
  register: () => {},
  login: () => {},
  loadUser: () => {},
});

export const useAuthContext = () => useContext(AuthContext);

const AuthContextProvider: FC = ({ children }) => {
  const [token, setToken] = useState<string | null>(localStorage.getItem('online-docs-token'));
  const [user, setUser] = useState<User | null>(null);
  const [socket, setSocket] = useState<Socket>();

  useEffect(() => {
    // if (!token) return;
    console.log(token, 'from user context get token');

    const s = io(`${SOCKET_SERVER_URL}/auth`, {
      extraHeaders: { Authorization: `Bearer ${token}` },
    });

    setSocket(s);
    console.log('connected to auth ws');
    return () => {
      s.disconnect();
    };
  }, [token, setSocket]);

  const loadUser = async () => {
    if (!token) return;
    console.log('TOKEN VAR');

    socket
      ?.emit('authenticate', { token }) //send the jwt
      .on('authenticated', () => {
        //do other things
        console.log('authenticated');
      })
      .on('unauthorized', (msg) => {
        console.log(`unauthorized: ${JSON.stringify(msg.data)}`);
        throw new Error(msg.data.type);
      });

    socket?.emit(AuthEvents.LOAD_USER);

    socket?.on(AuthEvents.USER_NOT_AUTH, () => {
      console.log('USER_NOT_AUTH');
      setUser(null);
    });
    socket?.once(AuthEvents.SET_USER, (user: User) => {
      console.log('SET USER', user);
      setUser(user);
    });
  };

  const login = async (userInfo: AuthUser) => {
    socket?.emit(AuthEvents.LOGIN, userInfo);
    socket?.on(AuthEvents.LOGIN_RESPONSE, (res) => {
      console.log({ res }, 'login auth context');
      // TODO:
      // load user?
      // login etc.
      // ui info/notification
      setToken(res.token);
      localStorage.setItem('online-docs-token', res.token);
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
    user,
    register,
    login,
    loadUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContextProvider;
