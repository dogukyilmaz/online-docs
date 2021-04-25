import { useDocContext } from "context/DocumentContext";
import { useEffect } from "react";
import { Document, Events, HandlerHooksProps } from "types";

const useFetchDocument = ({ quill, socket, docId }: HandlerHooksProps) => {
  const { setDocument } = useDocContext();
  useEffect(() => {
    socket?.once(Events.LOAD_DOCUMENT, ({ content, ...doc }: Document) => {
      // TODO: use doc information to for context
      setDocument(doc);
      quill?.setContents(content);
      quill?.enable();
      quill?.focus();
    });
    socket?.emit(Events.FETCH_DOCUMENT, docId);
  }, [quill, socket, docId, setDocument]);
};

export default useFetchDocument;
