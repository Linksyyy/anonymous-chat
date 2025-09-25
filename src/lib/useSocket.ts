import { useEffect } from "react";
import { socket } from "./socket";

export function useSocket(event: string, callback: (...args: any[]) => void) {
  useEffect(() => {
    socket.on(event, callback);
    return () => {
      socket.off(event, callback);
    };
  }, [event, callback]);
}
