import { useEffect } from "react";
import { socket } from "./socket";

export function useSocket(event, callback) {
  useEffect(() => {
    socket.on(event, callback);
    return () => {
      socket.off(event, callback);
    };
  }, [event, callback]);
}
