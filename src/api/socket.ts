import { io } from 'socket.io-client';

const SOCKET_URL = import.meta.env.VITE_API_SOCKET; 

export const socket = io(SOCKET_URL, {
  autoConnect: false,
  transports: ['websocket']
});

export const connectSocket = () => {
  if (!socket.connected) {
    socket.connect();
  }
};

export const disconnectSocket = () => {
  if (socket.connected) {
    socket.disconnect();
  }
};