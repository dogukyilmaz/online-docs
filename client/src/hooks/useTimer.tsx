import Quill from "quill";
import { useEffect, useState } from "react";

const useTimer = (quill?: Quill, interval = 1000): number => {
  const [timer, setTimer] = useState(0);

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
    }, interval);
    return () => clearInterval(i);
    // eslint-disable-next-line
  }, [quill]);

  return timer;
};

export default useTimer;
