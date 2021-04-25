import { useEffect } from "react";
import Delta from "quill-delta";
import { TextChangeHandler } from "quill";
import { useDocContext } from "context/DocumentContext";
import { Events } from "types";

const useTextChangeHandler = () => {
  const { quill, socket } = useDocContext();

  useEffect(() => {
    const changer: TextChangeHandler = (delta, oldContents, source) => {
      if (source === "user") socket?.emit(Events.DOCUMENT_CHANGE, delta);
    };
    quill?.on("text-change", changer);

    return () => {
      quill?.off("text-change", changer);
    };
  }, [socket, quill]);

  useEffect(() => {
    const updater = (delta: Delta) => {
      quill?.updateContents(delta);
    };
    socket?.on(Events.UPDATE_DOCUMENT, updater);

    return () => {
      socket?.off(Events.UPDATE_DOCUMENT, updater);
    };
  }, [socket, quill]);
};

export default useTextChangeHandler;
