import { useCallback, useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";
import Quill, { TextChangeHandler } from "quill";
import Delta from "quill-delta";
import "quill/dist/quill.snow.css";

interface Props {}

enum Events {
  DOCUMENT_CHANGE = "document-change",
  UPDATE_DOCUMENT = "update-document",
}

const TOOLBAR = [
  [{ font: [] }],
  [{ header: [1, 2, 3, 4, 5, 6, false] }],
  ["bold", "italic", "underline" /*, "strike"*/],
  [{ list: "ordered" }, { list: "bullet" }],
  // [{ indent: "-1" }, { indent: "+1" }],
  [{ align: [] }],
  [{ color: [] }, { background: [] }],
  [{ script: "sub" }, { script: "super" }],
  ["link"],
  ["image", "blockquote", "code-block"],
  // [{ direction: "rtl" }],
  ["clean"],
];

const URL = "http://localhost:5000";

const TextEditor = (props: Props) => {
  const [socket, setSocket] = useState<Socket>();
  const [quill, setQuill] = useState<Quill>();

  useEffect(() => {
    const s = io(URL);
    setSocket(s);

    return () => {
      s.disconnect();
    };
  }, []);

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

  const editorRef = useCallback((wrapper) => {
    if (!wrapper) return;
    wrapper.innerHTML = "";
    const editor = document.createElement("div");
    wrapper.append(editor);
    const q = new Quill(editor, { theme: "snow", modules: { toolbar: TOOLBAR } });
    setQuill(q);
  }, []);

  return <div id='text-editor-container' ref={editorRef}></div>;
};

export default TextEditor;
