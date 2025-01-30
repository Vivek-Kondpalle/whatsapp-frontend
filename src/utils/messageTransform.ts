import { DMMessage, ChannelMessage } from '@/types/get-all-messages.type';
import { SocketMessage, SocketChannelMessage } from '@/types/socket-message.type';

export const transformSocketMessage = (
  message: SocketMessage | SocketChannelMessage,
  selectedChatType: 'contact' | 'channel'
): DMMessage | ChannelMessage => {
  if (selectedChatType === 'channel') {
    return {
      _id: message._id,
      content: message.content,
      messageType: message.messageType,
      sender: message.sender, // Keep sender as full User object
      recipient: null, // Channel messages have no recipient
      timestamp: message.timestamp,
      _v: message.__v, // Ensure _v is included
      fileUrl: 'fileUrl' in message ? message.fileUrl : undefined,
      channelId: 'channelId' in message ? message.channelId : undefined // Only include channelId if it exists
    } as ChannelMessage;
  }

  return {
    _id: message._id,
    content: message.content,
    messageType: message.messageType,
    sender: (message.sender as { _id: string })._id, // Extract sender ID
    recipient: (message.recipient as { _id: string })._id, // Extract recipient ID
    timestamp: message.timestamp,
    _v: message.__v,
    fileUrl: 'fileUrl' in message ? message.fileUrl : undefined
  } as DMMessage;
};
