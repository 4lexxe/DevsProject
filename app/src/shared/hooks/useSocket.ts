import { useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';

const useSocket = () => {
  const [backendOnline, setBackendOnline] = useState(true);
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000';
    const newSocket = io(backendUrl, {
      autoConnect: true,
      reconnectionAttempts: 5,
      timeout: 5000,
    });

    setSocket(newSocket);

    newSocket.on('connect', () => {
      console.log('Conectado al servidor');
      setBackendOnline(true);
    });

    newSocket.on('disconnect', () => {
      console.log('Desconectado del servidor');
      setBackendOnline(false);
    });

    newSocket.on('serverStatus', (data) => {
      console.log('Estado del servidor:', data.status);
      setBackendOnline(data.status === 'online');
    });

    return () => {
      newSocket.disconnect();
    };
  }, []);

  return { backendOnline, socket };
};

export default useSocket;