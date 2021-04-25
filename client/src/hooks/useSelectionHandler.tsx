import { useEffect } from "react";
import { RangeStatic, SelectionChangeHandler } from "quill";
import { useDocContext } from "context/DocumentContext";
import { Events } from "types";

const useSelectionHandler = () => {
  const { quill, socket } = useDocContext();

  useEffect(() => {
    const selector: SelectionChangeHandler = (range, oldRange, source) => {
      if (source === "user") socket?.emit(Events.SELECTION_CHANGE, range);
    };
    quill?.on("selection-change", selector);

    return () => {
      quill?.off("selection-change", selector);
    };
  }, [socket, quill]);

  useEffect(() => {
    const updater = (range: RangeStatic) => {
      // TODO: No need to set selection just show cursor and set cursors place
      quill?.setSelection(range);
    };
    socket?.on(Events.UPDATE_SELECTION, updater);

    return () => {
      socket?.off(Events.UPDATE_SELECTION, updater);
    };
  }, [socket, quill]);
};

export default useSelectionHandler;
