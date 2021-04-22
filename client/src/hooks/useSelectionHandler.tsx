import { useEffect } from "react";
import { RangeStatic, SelectionChangeHandler } from "quill";
import { Events, HandlerHooksProps } from "../types";

const useSelectionHandler = ({ quill, socket }: HandlerHooksProps) => {
  useEffect(() => {
    const selector: SelectionChangeHandler = (range, oldRange, source) => {
      if (source === "user") socket?.emit(Events.SELECTION_CHANGE, range);
      console.log(range, "from editor SELECTION_CHANGE");
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

  return null;
};

export default useSelectionHandler;
