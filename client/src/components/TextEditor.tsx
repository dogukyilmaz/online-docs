import { useCallback } from "react";
import Quill from "quill";
import "quill/dist/quill.snow.css";

interface Props {}

const TextEditor = (props: Props) => {
  const editorRef = useCallback((wrapper) => {
    if (!wrapper) return;
    wrapper.innerHTML = "";
    const editor = document.createElement("div");
    wrapper.append(editor);
    new Quill(editor, { theme: "snow" });
  }, []);

  return <div id='text-editor-container' ref={editorRef}></div>;
};

export default TextEditor;
