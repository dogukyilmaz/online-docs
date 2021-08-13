import { login, register, loadUser } from '../../controllers/user';
import { AuthEvents, SocketJWT } from '../../types/types';
import { authorize } from 'socketio-jwt';
import jwtAuth from 'socketio-jwt-auth';

// authNs.use(
//   socketioJwt.authorize({
//     secret: process.env.JWT_SECRET!,
//     timeout: 15000,
//     auth_header_required: true,
//     handshake: true,
//   }) as any
// );

// authNs.use((socket: SocketJWT, next: any) => {
//   console.log("error");
//   const err: any = new Error("not authorized");
//   err.data = { content: "Please retry later" }; // additional details
//   next(err);
// });

const authSocket = (socket: SocketJWT) => {
  console.log('START OF AS');
  socket.on(AuthEvents.REGISTER, async (authInfo) => {
    console.log('REGISTER');
    const result = await register(authInfo);
    socket.emit(AuthEvents.REGISTER_RESPONSE, result);
    console.log(AuthEvents.REGISTER, result);
  });

  socket.on(AuthEvents.LOGIN, async (authInfo) => {
    console.log('LOGIN', authInfo);
    const result = await login(authInfo);
    socket.emit(AuthEvents.LOGIN_RESPONSE, result);
  });

  // const user = "erss";

  socket.on(AuthEvents.LOAD_USER, async () => {
    // socket.use(
    //   authorize({
    //     secret: process.env.JWT_SECRET!,
    //     timeout: 15000,
    //     auth_header_required: true,
    //     handshake: true,
    //   }) as any
    // );
    console.log('tokentoken', socket?.decoded_token);
    const jwt = socket?.decoded_token || '';

    console.log('authNS hererere', jwt.user);
    console.log(socket.handshake.headers);

    console.log(jwt, 'jwt');
    // if (!jwt) {
    //   console.log('here');
    //   socket.emit(AuthEvents.USER_NOT_AUTH);
    //   return;
    // }

    console.log('LOAD_USER');
    if (!jwt) return;
    console.log('token');
    const res = await loadUser(jwt.user);
    // TODO: handle fail situation
    if (res.success) socket.emit(AuthEvents.SET_USER, res.user);
  });
};

export default authSocket;
