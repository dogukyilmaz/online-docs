import { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router";
import { io, Socket } from "socket.io-client";
import Quill from "quill";
import { useTextChangeHandler, useSelectionHandler, useTimer, useFetchDocument, useAutoSaver } from "hooks";
import { useDocContext } from "context/DocumentContext";
import { SOCKET_SERVER_URL } from "types";
import "quill/dist/quill.snow.css";

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

interface TextEditorProps {}

interface ParamTypes {
  docId: string;
}

const TextEditor = (props: TextEditorProps) => {
  const [socket, setSocket] = useState<Socket>();
  const [quill, setQuill] = useState<Quill>();
  const { docId } = useParams<ParamTypes>();

  useTimer(quill, 200);
  useFetchDocument({ quill, socket, docId });
  useAutoSaver({ quill, socket }, 2000);
  useTextChangeHandler({ quill, socket });
  useSelectionHandler({ quill, socket }); // TODO: cursors

  const { setDocument } = useDocContext();

  useEffect(() => {
    const s = io(SOCKET_SERVER_URL);
    setSocket(s);
    return () => {
      s.disconnect();
      setDocument(null);
    };
  }, [setDocument]);

  const editorRef = useCallback((wrapper) => {
    if (!wrapper) return;
    wrapper.innerHTML = "";
    const editor = document.createElement("div");
    wrapper.append(editor);
    const q = new Quill(editor, { theme: "snow", modules: { toolbar: TOOLBAR } });
    q.disable();
    setQuill(q);
  }, []);

  return <div id='text-editor-container' ref={editorRef}></div>;
};

export default TextEditor;
