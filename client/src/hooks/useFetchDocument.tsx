import { useEffect } from "react";
import { useDocContext } from "context/DocumentContext";
import { Document, Events } from "types";
import { useHistory } from "react-router";

const useFetchDocument = (docId: string) => {
  const { quill, socket, setDocument } = useDocContext();
  const history = useHistory();
  useEffect(() => {
    socket?.once(Events.LOAD_DOCUMENT, ({ content, ...doc }: Document) => {
      // TODO: use doc information to for context
      setDocument(doc);
      quill?.setContents(content);
      quill?.enable();
      quill?.focus();
    });
    socket?.on(Events.FETCH_DOCUMENT_ERROR, (message) => {
      // if not authorized, redirect to new document
      alert(message);
      history.push("/");
    });
    socket?.emit(Events.FETCH_DOCUMENT, docId);

    return () => {
      socket?.off(Events.FETCH_DOCUMENT_ERROR);
    };
  }, [quill, socket, docId, history, setDocument]);
};

export default useFetchDocument;
