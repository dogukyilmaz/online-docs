import { findDocOrCreate, updateDoc } from '../../controllers/doc';
import { Events, SocketJWT } from '../../types/types';

// docNs.use(
//   socketioJwt.authorize({
//     secret: process.env.JWT_SECRET!,
//     timeout: 15000,
//     auth_header_required: true,
//     handshake: true,
//   }) as any
// );

const docSocket = (socket: SocketJWT) => {
  console.log('docNs');
  const { user } = socket.decoded_token;

  socket.on(Events.FETCH_DOCUMENT, async (docId: string) => {
    // TODO: check authorization
    const res = await findDocOrCreate(docId, user);
    if (!res.success) {
      // TODO: specify error responses
      // emit multi scenerios by types
      // socket.emit(Events.FETCH_DOCUMENT_ERROR, res.message);
      console.log('error');
      return;
    }

    socket.join(docId);

    socket.emit(Events.LOAD_DOCUMENT, res.doc);

    socket.on(Events.DOCUMENT_CHANGE, (delta) => {
      socket.to(docId).emit(Events.UPDATE_DOCUMENT, delta);
    });

    socket.on(Events.SAVE_DOCUMENT, async (content) => {
      await updateDoc(docId, content);
    });
  });

  socket.on(Events.SELECTION_CHANGE, (range) => {
    socket.broadcast.emit(Events.UPDATE_SELECTION, range);
  });
};

export default docSocket;
