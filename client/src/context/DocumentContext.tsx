import { createContext, FC, useContext, useState } from 'react';
import { Socket } from 'socket.io-client';
import Quill from 'quill';
import { Document } from 'types';

type NullableDoc = Omit<Document, 'content'> | null;

export interface DocumentContext {
  document?: NullableDoc;
  setDocument: (doc: NullableDoc) => void;
  socket?: Socket;
  setSocket: (s: Socket) => void;
  quill?: Quill;
  setQuill: (q: Quill) => void;
}

const DocContext = createContext<DocumentContext>({
  document: undefined,
  setDocument: () => {},
  socket: undefined,
  setSocket: () => {},
  quill: undefined,
  setQuill: () => {},
});

export const useDocContext = () => useContext(DocContext);

const DocContextProvider: FC = ({ children }) => {
  const [document, setDocument] = useState<NullableDoc>();
  const [socket, setSocket] = useState<Socket>();
  const [quill, setQuill] = useState<Quill>();

  const value = {
    document,
    setDocument,
    socket,
    setSocket,
    quill,
    setQuill,
  };

  return <DocContext.Provider value={value}>{children}</DocContext.Provider>;
};

export default DocContextProvider;
