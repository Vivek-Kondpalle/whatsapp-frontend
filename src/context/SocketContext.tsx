import { useAppStore } from '@/store';
import { SocketChannelMessage, SocketMessage } from '@/types/socket-message.type';
import { HOST } from '@/utils/constants';
import { createContext, ReactNode, useContext, useEffect, useRef } from 'react';
import { io, Socket } from 'socket.io-client';

type SocketContextType = Socket | null;

type SocketProviderProps = {
  children: ReactNode;
};

// eslint-disable-next-line react-refresh/only-export-components
export const SocketContext = createContext<SocketContextType>(null);

// eslint-disable-next-line react-refresh/only-export-components
export const useSocket = (): SocketContextType => {
  return useContext(SocketContext);
};

export const SocketProvider = ({ children }: SocketProviderProps) => {
  const socket = useRef<Socket | null>(null);
  const { userInfo } = useAppStore();

  useEffect(() => {
    if (userInfo) {
      socket.current = io(HOST, {
        withCredentials: true,
        query: { userId: userInfo.id }
      });
      socket.current.on('connect', () => {
        console.log('Connected to socket server');
      });

      const handleRecieveMessage = (message: SocketMessage) => {
        const { selectedChatData, selectedChatType, addMessage } = useAppStore.getState();

        if (
          selectedChatType !== undefined &&
          selectedChatData &&
          (selectedChatData._id === message.sender._id ||
            selectedChatData._id === message.recipient._id)
        ) {
          addMessage(message);
          console.log(' message in recieve ------>>>>>>>> ', message);
        }
      };

      const handleRecieveChannelMessage = (message: SocketChannelMessage) => {
        const { selectedChatData, addMessage } = useAppStore.getState();

        if (selectedChatData !== undefined && selectedChatData._id === message.channelId) {
          console.log(' recieve channel message ----->>>> ', message);
          addMessage(message);
        }
      };

      socket.current.on('recieveMessage', handleRecieveMessage);
      socket.current.on('recieve-channel-message', handleRecieveChannelMessage);

      return () => {
        socket.current?.disconnect();
      };
    }
  }, [userInfo]);

  return <SocketContext.Provider value={socket.current}>{children}</SocketContext.Provider>;
};
