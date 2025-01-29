import { ChannelMessage, DMMessage } from "@/types/get-all-messages.type";
import { DmContact } from "@/types/get-dm-contact.type";
import { Channel } from "@/types/get-user-channels.type";
import { StateCreator } from "zustand";

export type ChatSlice = {
    selectedChatData: undefined | DmContact | Channel;
    setSelectedChatData: ( selectedChatData: undefined | DmContact | Channel) => void;
    selectedChatType: undefined | 'channel' | 'contact';
    setSelectedChatType: (selectedChatType: undefined | 'channel' | 'contact') => void;
    channels: Channel[] | [];
    setChannels: (channels: Channel[]) => void;
    isUploading: boolean;
    setIsUploading: (isUploading: boolean) => void;
    isDownloading: boolean;
    setIsDownloading: (isDownloading: boolean) => void;
    addChannel: (channel: Channel) => void;
    closeChat: () => void;
    fileUploadProgress: number;
    setFileUploadProgress: (fileUploadProgress: number) => void;
    fileDownloadProgress: number;
    setFileDownloadProgress: (fileDownloadProgress: number) => void;
    selectedChatMessages: DMMessage[] | ChannelMessage[] | [];
    setSelectedChatMessages: (selectedChatMessages: DMMessage[] | ChannelMessage[] | []) => void;
    directMessagesContacts: DmContact[] | [];
    setDirectMessagesContacts: (directMessagesContacts: DmContact[]) => void;

    // 

    addMessage: (message: any) => void;
}

export const createChatSlice: StateCreator<ChatSlice, [], [], ChatSlice> = (set, get) => ({
    selectedChatType: undefined,
    selectedChatData: undefined,
    selectedChatMessages: [],
    directMessagesContacts: [],
    isUploading: false,
    isDownloading: false,
    fileUploadProgress: 0,
    fileDownloadProgress: 0,
    channels: [],
    setChannels: (channels) => set({ channels }),
    setIsUploading: (isUploading) => set({ isUploading }),
    setIsDownloading: (isDownloading) => set({ isDownloading }),
    setFileUploadProgress: (fileUploadProgress) => set({ fileUploadProgress }),
    setFileDownloadProgress: (fileDownloadProgress) => set({ fileDownloadProgress }),
    setSelectedChatType: (selectedChatType) => set({selectedChatType}),
    setSelectedChatData: (selectedChatData) => set({selectedChatData}),
    setSelectedChatMessages: (selectedChatMessages) => set({selectedChatMessages}),
    setDirectMessagesContacts: (directMessagesContacts) => set({directMessagesContacts}),
    addChannel: (channel) => {
        const channels = get().channels;
        set({channels: [...channels, channel]})
    },
    closeChat: () => set({
        selectedChatType: undefined,
        selectedChatData: undefined,
        selectedChatMessages: [],
    }),
    addMessage: (message) => {
        const selectedChatMessages = get().selectedChatMessages;
        const selectedChatType = get().selectedChatType;

        set({
            selectedChatMessages:[
                ...selectedChatMessages,
                {
                    ...message,
                    recipient: selectedChatType === 'channel' ? message.recipient : message.recipient._id,
                    sender: selectedChatType === 'channel' ? message.sender : message.sender._id,
                }
            ],
        })
    }
})