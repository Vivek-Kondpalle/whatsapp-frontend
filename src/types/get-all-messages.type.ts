// DM message structure
export type DMMessage = {
  content: string;
  messageType: "text" | "file";
  sender: string; // user ID
  recipient: string; // user ID
  timestamp: string; // ISO timestamp
  _id: string;
  _v: number;
  fileUrl?: string;
};

// Channel message structure
export type ChannelMessage = {
  content: string;
  messageType: "text" | "file";
  sender: {
    _id: string;
    email: string;
    firstName: string;
    lastName: string;
    color: number;
    image?: string;
  };
  recipient: null; // No specific recipient in a channel
  timestamp: string; // ISO timestamp
  _id: string;
  _v: number;
  fileUrl?: string;
};

// Response types
export type GetAllDMMessagesResponse = {
  messages: DMMessage[];
};

export type GetChannelMessagesResponse = {
  messages: ChannelMessage[];
};
