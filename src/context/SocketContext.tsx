import React, { createContext, useContext, useMemo, useEffect } from 'react';
import { io, Socket } from 'socket.io-client';
import env from "../config/envConfig";

const SocketContext = createContext<Socket | null>(null);

export const SocketProvider = ({ children }: { children: React.ReactNode }) => {
  const socketUrl = env.VITE_SOCKET_URL || 'http://localhost:5000';
  
  const socket = useMemo(() => {
    return io(socketUrl, {
      transports: ['websocket'],
      withCredentials: true,
      autoConnect: true,
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 5000,
    });
  }, [socketUrl]);

  useEffect(() => {
    socket.on('connect', () => {
      console.log('✅ Socket connected:', socket.id);
    });

    socket.on('connect_error', (error) => {
      console.error('❌ Socket connection error:', error);
    });

    return () => {
      socket.off('connect');
      socket.off('connect_error');
      socket.disconnect();
    };
  }, [socket]);

  return (
    <SocketContext.Provider value={socket}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error('useSocket must be used within a SocketProvider');
  }
  return context;
};