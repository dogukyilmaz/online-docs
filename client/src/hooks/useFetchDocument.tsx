import { useEffect } from "react";
import { Document, Events, HandlerHooksProps } from "types";

const useFetchDocument = ({ quill, socket, docId }: HandlerHooksProps) => {
  useEffect(() => {
    socket?.once(Events.LOAD_DOCUMENT, (doc: Document) => {
      // TODO: use doc information to for context
      quill?.setContents(doc.content);
      quill?.enable();
      quill?.focus();
    });
    socket?.emit(Events.FETCH_DOCUMENT, docId);
  }, [quill, socket, docId]);
};

export default useFetchDocument;
