import { loadUser } from '../../controllers/user';
import { AuthEvents, SocketJWT } from '../../types/types';

const userSocket = (socket: SocketJWT) => {
  console.log('userNs.on');
  const jwt = socket?.decoded_token || '';

  console.log(jwt, 'jwt');
  if (!jwt) {
    console.log('here');
    socket.emit(AuthEvents.USER_NOT_AUTH);
    return;
  }
  // const user = "erss";

  console.log('userNs hererere', jwt.user);
  console.log(socket.handshake.headers);

  socket.on(AuthEvents.LOAD_USER, async () => {
    console.log('LOAD_USER');
    if (!jwt) return;
    console.log('token');
    const res = await loadUser(jwt.user);
    // TODO: handle fail situation
    if (res.success) socket.emit(AuthEvents.SET_USER, res.user);
  });
};

export default userSocket;
