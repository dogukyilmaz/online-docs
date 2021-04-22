import { useCallback, useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";
import Quill from "quill";
import { useTextChangeHandler, useSelectionHandler } from "hooks";
import { SOCKET_SERVER_URL } from "types";
import "quill/dist/quill.snow.css";

interface Props {}

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

const TextEditor = (props: Props) => {
  const [socket, setSocket] = useState<Socket>();
  const [quill, setQuill] = useState<Quill>();

  useTextChangeHandler({ quill, socket });
  useSelectionHandler({ quill, socket });

  useEffect(() => {
    const s = io(SOCKET_SERVER_URL);
    setSocket(s);
    return () => {
      s.disconnect();
    };
  }, []);

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
