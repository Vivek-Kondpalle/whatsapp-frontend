export type User = {
  _id: string;
  email: string;
  firstName: string;
  lastName: string;
  color: number;
  image?: string; // Optional, as it exists for sender but not recipient
};

export type SocketMessage = {
  _id: string;
  content: string;
  messageType: 'text' | 'file'; // Assuming these are the possible values
  recipient: User;
  sender: User;
  timestamp: string; // ISO string format
  __v: number;
};

export type SocketChannelMessage = {
  _id: string;
  channelId: string;
  content: string;
  messageType: 'text' | 'file'; // Assuming these are the possible values
  recipient: null; // Always null for channel messages
  sender: User;
  timestamp: string; // ISO string format
  __v: number;
};
