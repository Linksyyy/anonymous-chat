import { useEffect } from "react";
import { socket } from "./socket";

export function useSocket(event, callback) {
  let soc;
  useEffect(() => {
    socket.on(event, callback);
    soc = () => socket.off(event, callback);
  }, [event, callback]);
  return soc;
}
