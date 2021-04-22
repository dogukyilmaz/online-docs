import { useCallback, useEffect } from "react";
import Quill from "quill";
import { io } from "socket.io-client";
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

const URL = "http://localhost:5000";

const TextEditor = (props: Props) => {
  useEffect(() => {
    const socket = io(URL);

    return () => {
      socket.disconnect();
    };
  }, []);

  const editorRef = useCallback((wrapper) => {
    if (!wrapper) return;
    wrapper.innerHTML = "";
    const editor = document.createElement("div");
    wrapper.append(editor);
    new Quill(editor, { theme: "snow", modules: { toolbar: TOOLBAR } });
  }, []);

  return <div id='text-editor-container' ref={editorRef}></div>;
};

export default TextEditor;
