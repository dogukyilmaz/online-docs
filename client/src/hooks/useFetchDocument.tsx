import { useEffect } from "react";
import { Events, HandlerHooksProps } from "types";
import Delta from "quill-delta";

const useFetchDocument = ({ quill, socket, docId }: HandlerHooksProps) => {
  useEffect(() => {
    socket?.once(Events.LOAD_DOCUMENT, (doc: Delta) => {
      quill?.setContents(doc);
      quill?.enable();
      quill?.focus();
    });
    socket?.emit(Events.FETCH_DOCUMENT, docId);
  }, [quill, socket, docId]);

  return null;
};

export default useFetchDocument;
