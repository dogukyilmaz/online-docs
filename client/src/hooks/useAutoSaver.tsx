import { useEffect } from "react";
import { Events, HandlerHooksProps } from "types";

const useAutoSaver = ({ quill, socket }: HandlerHooksProps, intervalMs = 10000) => {
  useEffect(() => {
    const interval = setInterval(() => {
      socket?.emit(Events.SAVE_DOCUMENT, quill?.getContents());
    }, intervalMs);

    return () => clearInterval(interval);
    // eslint-disable-next-line
  }, [quill, socket]);

  return null;
};

export default useAutoSaver;
