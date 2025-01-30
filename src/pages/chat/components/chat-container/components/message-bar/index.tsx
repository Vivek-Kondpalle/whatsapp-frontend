import { ChangeEvent, useEffect, useRef, useState } from 'react';
import { GrAttachment } from 'react-icons/gr';
import { RiEmojiStickerLine } from 'react-icons/ri';
import { IoSend } from 'react-icons/io5';
import EmojiPicker, { EmojiClickData, Theme } from 'emoji-picker-react';
import { useAppStore } from '@/store';
import { apiClient } from '@/lib/api-client';
import { UPLOAD_FILE_ROUTE } from '@/utils/constants';
import { FileUploadRequest, FileUploadResponse } from '@/types/upload-file.type';
import { useSocket } from '@/context/SocketContext';

const MessageBar = () => {
  const emojiRef = useRef<HTMLDivElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const socket = useSocket();
  const { userInfo, selectedChatData, selectedChatType, setIsUploading, setFileUploadProgress } =
    useAppStore();
  const [emojiPickerOpen, setEmojiPickerOpen] = useState(false);
  const [message, setMessage] = useState('');

  const handleAddEmoji = (emoji: EmojiClickData) => {
    setMessage((msg) => msg + emoji.emoji);
  };

  const handleSendMessage = async () => {
    if (!userInfo || !selectedChatData || !socket) return;

    if (selectedChatType == 'contact') {
      socket.emit('sendMessage', {
        sender: userInfo.id,
        recipient: selectedChatData._id,
        content: message,
        messageType: 'text',
        fileUrl: undefined
      });
    } else if (selectedChatType == 'channel') {
      socket.emit('send-channel-message', {
        sender: userInfo.id,
        channelId: selectedChatData._id,
        content: message,
        messageType: 'text',
        fileUrl: undefined
      });
    }
    setMessage('');
  };

  useEffect(() => {
    function handleClickOutside(event: MouseEvent | Event) {
      if (emojiRef.current && !emojiRef.current?.contains(event.target as Node)) {
        setEmojiPickerOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [emojiRef]);

  const handleAttachmentClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleAttachmentChange = async (event: ChangeEvent<HTMLInputElement>) => {
    try {
      const file = event?.target?.files?.[0];
      if (file) {
        const formData: FileUploadRequest = new FormData();
        formData.append('file', file);
        setIsUploading(true);
        const response = await apiClient.post<FileUploadResponse>(UPLOAD_FILE_ROUTE, formData, {
          withCredentials: true,
          onUploadProgress: (data) => {
            setFileUploadProgress(Math.round((100 * data?.loaded) / (data?.total || 1)));
          }
        });

        if (response.status === 200 && response.data && userInfo && selectedChatData && socket) {
          setIsUploading(false);
          if (selectedChatType === 'contact') {
            socket.emit('sendMessage', {
              sender: userInfo.id,
              recipient: selectedChatData._id,
              content: '',
              messageType: 'file',
              fileUrl: response.data.filePath
            });
          } else if (selectedChatType === 'channel') {
            socket.emit('send-channel-message', {
              sender: userInfo.id,
              channelId: selectedChatData._id,
              content: undefined,
              messageType: 'file',
              fileUrl: response.data.filePath
            });
          }
        }
      }
    } catch (error) {
      setIsUploading(false);
      console.log(error);
    }
  };

  return (
    <div className="h-[10vh] bg-[#1c1d25] flex justify-center items-center px-8 mb-6 gap-6">
      <div className="flex-1 flex bg-[#2a2b33] rounded-md items-center gap-5 pr-5">
        <input
          type="text"
          className="flex-1 p-5 bg-transparent rounded-md focus:border-none focus:outline-none"
          placeholder="Enter Message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <button
          className="text-neutral-500 focus:border-none focus:outline-none focus:text-white duration-300 transition-all"
          onClick={handleAttachmentClick}
        >
          <GrAttachment className="text-2xl" />
        </button>
        <input
          type="file"
          ref={fileInputRef}
          className="hidden"
          onChange={handleAttachmentChange}
        />
        <div className="relative">
          <button
            className="text-neutral-500 focus:border-none focus:outline-none focus:text-white duration-300 transition-all"
            onClick={() => setEmojiPickerOpen(true)}
          >
            <RiEmojiStickerLine className="text-2xl" />
          </button>
          <div className="absolute bottom-16 right-0" ref={emojiRef}>
            <EmojiPicker
              theme={Theme.DARK}
              open={emojiPickerOpen}
              onEmojiClick={handleAddEmoji}
              autoFocusSearch={false}
            />
          </div>
        </div>
      </div>
      <button
        className="bg-[#8417ff] rounded-md flex items-center justify-center p-5 focus:border-none focus:outline-none focus:text-white duration-300 transition-all"
        onClick={handleSendMessage}
      >
        <IoSend className="text-2xl" />
      </button>
    </div>
  );
};

export default MessageBar;
