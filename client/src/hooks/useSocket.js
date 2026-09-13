import { useEffect, useRef } from 'react';
import { io } from 'socket.io-client';

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000';

/**
 * Opens a single Socket.IO connection for the component's lifetime and
 * calls onEvent(eventName, payload) style handlers passed in via `handlers`.
 *
 * Usage:
 *   useSocket({
 *     'vehicle:location': (data) => { ... },
 *     'vehicle:status-update': (data) => { ... },
 *   });
 */
export default function useSocket(handlers = {}) {
  const socketRef = useRef(null);
  const handlersRef = useRef(handlers);
  handlersRef.current = handlers;

  useEffect(() => {
    const socket = io(SOCKET_URL, { transports: ['websocket', 'polling'] });
    socketRef.current = socket;

    const boundHandlers = {};
    Object.keys(handlersRef.current).forEach((event) => {
      const fn = (payload) => handlersRef.current[event]?.(payload);
      boundHandlers[event] = fn;
      socket.on(event, fn);
    });

    return () => {
      Object.keys(boundHandlers).forEach((event) => socket.off(event, boundHandlers[event]));
      socket.disconnect();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return socketRef;
}
