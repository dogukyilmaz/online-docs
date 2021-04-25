import { useEffect } from "react";
import { useDocContext } from "context/DocumentContext";
import { Events } from "types";

const useAutoSaver = (intervalMs = 10000) => {
  const { quill, socket } = useDocContext();

  useEffect(() => {
    const interval = setInterval(() => {
      socket?.emit(Events.SAVE_DOCUMENT, quill?.getContents());
    }, intervalMs);

    return () => clearInterval(interval);
    // eslint-disable-next-line
  }, [quill, socket]);
};

export default useAutoSaver;
