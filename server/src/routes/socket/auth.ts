import { login, register } from '../../controllers/user';
import { AuthEvents, SocketJWT } from '../../types/types';

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
  console.log('authNs');

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
};

export default authSocket;
