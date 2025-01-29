/*
    DM contact
    messages: [{
        content: string,
        messageType: "text",
        sender: string,
        timestamp: string,
        _id: string
        recipient: string
        _v: number
    }]

    Channel message
    messages: [{
        content: "SOme text"
        messageType: "text"
        recipient: null
        sender: {
            color: 2
            email: "chat@six.com"
            firstName: "Chat"
            image: "uploads/profiles/1738090464440-Screenshot-18.png"
            lastName: "Six"
            _id: "679920c89b42d27895ed838e"
        }
        timestamp: "2025-01-29T18:04:06.822Z"
        __v: 0
        _id: "679a6d96fd7510b577ec9917"
    }]
*/

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
