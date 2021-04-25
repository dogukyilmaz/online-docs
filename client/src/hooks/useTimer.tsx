import { useEffect, useState } from "react";
import { useDocContext } from "context/DocumentContext";

const useTimer = (saveInterval = 1000): number => {
  const [timer, setTimer] = useState(0);
  const { quill } = useDocContext();

  useEffect(() => {
    setTimer(0);
  }, []);

  useEffect(() => {
    if (quill?.isEnabled()) return;
    quill?.setText(`Loadi${".".repeat(timer)}ing!`);
  }, [quill, timer]);

  useEffect(() => {
    if (quill?.isEnabled()) return;
    const i = setInterval(() => {
      setTimer((s) => s + 1);
    }, saveInterval);
    return () => clearInterval(i);
    // eslint-disable-next-line
  }, [quill]);

  return timer;
};

export default useTimer;
