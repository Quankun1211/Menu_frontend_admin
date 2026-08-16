import React, { createContext, useContext, useMemo, useEffect, useRef } from 'react';
import { message } from 'antd';
import { io, Socket } from 'socket.io-client';
import env from "../config/envConfig";
import { useAppStore } from "../store/app.store";
import { getToken } from "../utils/token";

const SocketContext = createContext<Socket | null>(null);

export const SocketProvider = ({ children }: { children: React.ReactNode }) => {
  const socketUrl = env.VITE_SOCKET_URL || window.location.origin;
  const userData = useAppStore((state) => state.userData);
  const connectedOnce = useRef(false);
  
  const socket = useMemo(() => {
    return io(socketUrl, {
      transports: ['websocket'],
      withCredentials: true,
      autoConnect: false,
      auth: { token: getToken() },
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 5000,
    });
  }, [socketUrl]);

  useEffect(() => {
    if (userData) {
      socket.auth = { token: getToken() };
      socket.connect();
    }
    else socket.disconnect();

    socket.on('connect', () => {
      console.log('✅ Socket connected:', socket.id);
      // if (connectedOnce.current) message.success("Đã khôi phục kết nối thời gian thực.");
      connectedOnce.current = true;
    });

    socket.on('disconnect', () => {
      if (connectedOnce.current) message.warning("Đã mất kết nối thời gian thực. Hệ thống đang tự kết nối lại.");
    });

    socket.on('connect_error', (error) => {
      console.error('❌ Socket connection error:', error);
    });

    return () => {
      socket.off('connect');
      socket.off('connect_error');
      socket.off('disconnect');
      socket.disconnect();
    };
  }, [socket, userData]);

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
