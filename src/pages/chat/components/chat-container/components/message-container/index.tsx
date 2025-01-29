import { useAppStore } from "@/store";
import { useEffect, useRef, useState } from "react";
import moment from 'moment'
import { apiClient } from "@/lib/api-client";
import { GET_ALL_MESSAGES_ROUTE, GET_CHANNEL_MESSAGES_ROUTE, HOST } from "@/utils/constants";
import { MdFolderZip } from 'react-icons/md'
import { IoArrowDown, IoCloseSharp } from 'react-icons/io5'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getColors } from "@/lib/utils";
import { ChannelMessage, DMMessage, GetAllDMMessagesResponse, GetChannelMessagesResponse } from "@/types/get-all-messages.type";

const isDMMessage = (message: DMMessage | ChannelMessage): message is DMMessage => {
  return typeof message.sender === "string"; // Since DMMessage.sender is a string
};

const MessageContainer = () => {
  const scrollRef = useRef<HTMLDivElement | null>();
  const { selectedChatData, selectedChatType, userInfo, selectedChatMessages, setSelectedChatMessages, setFileDownloadProgress, setIsDownloading } = useAppStore();
  const [showImage, setShowImage] = useState(false)
  const [imageUrl, setImageUrl] = useState('')

  useEffect(() => {

    const getAllMessages = async () => {
      try {
        if(selectedChatData){
          const response = await apiClient.post<GetAllDMMessagesResponse>(GET_ALL_MESSAGES_ROUTE, { id: selectedChatData._id }, { withCredentials: true })
          if(response.data.messages){
            setSelectedChatMessages(response.data.messages)
          }
        }
      } catch (error) {
        console.log(error)
      }
    }

    const getChannelMessages = async () => {
      try {
        if(selectedChatData){
          const response = await apiClient.get<GetChannelMessagesResponse>(`${GET_CHANNEL_MESSAGES_ROUTE}/${selectedChatData._id}`, { withCredentials: true })
            if(response.data.messages){
              setSelectedChatMessages(response.data.messages)
            }
        }
      } catch (error) {
        console.log(error)
      }
    }


    if(selectedChatData && selectedChatData._id){
      if(selectedChatType == 'contact'){
        getAllMessages()
      } else if(selectedChatType == 'channel'){
        getChannelMessages()
      }
    }
  }, [selectedChatType, selectedChatData, setSelectedChatMessages])

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [selectedChatMessages]);

  const checkIfImage = (filePath: string) => {
    if(filePath){
      const imageRegex = /\.(jpg|jpeg|png|gif|bmp|tiff|tif|webp|svg|ico|heic|heif)$/i;
      return imageRegex.test(filePath)
    }
  }

  const renderMessages = () => {
    let lastDate: null | string = null;
    return selectedChatMessages.map((message, index) => {
      const messageData = moment(message.timestamp).format('YYYY-MM-DD');
      const showDate = messageData !== lastDate
      lastDate = messageData

      return (
        <div key={index}>
          {
            showDate && (
              <div className="text-center text-gray-500 my-2">
                {
                  moment(message.timestamp).format('LL')
                }
              </div>
            )
          }
          {
            selectedChatType === 'contact' && isDMMessage(message) && renderDMMessages(message)
          }
          {
            selectedChatType === 'channel' && !isDMMessage(message) && renderChannelMessages(message)
          }
        </div>
      )
    })
  }

  const downloadFile = async (url: string) => {
    setIsDownloading(true)
    setFileDownloadProgress(0)
    const response = await apiClient.get(`${HOST}/${url}`, { 
      responseType: 'blob',
      onDownloadProgress: (progressEvent) => {
        const loaded = progressEvent.loaded;
        const total = progressEvent.total ?? 1;

        console.log(' total ', total)
        const percentCompleted = Math.round((loaded * 100) / total);
        console.log(' percentCompleted ', percentCompleted)
        setFileDownloadProgress(percentCompleted)
      } 
    })
    const urlBlob = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = urlBlob;
    link.setAttribute('download', url.split('/').pop() ?? "file");
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(urlBlob);
    setIsDownloading(false)
    setFileDownloadProgress(0)
  }

  const renderDMMessages = (message: DMMessage) => (
    <>
      {
        selectedChatData &&
        <div className={`${message.sender === selectedChatData._id ? 'text-left' : 'text-right'}`}>
          {
            message.messageType === "text" && (
              <div className={`${message.sender !== selectedChatData._id ? "bg-[#8417ff]/5 text-[#8417ff]/90 border-[#8417ff]/50" : "bg-[#2a2b33]/5 text-white/80 border-[#ffffff]/20"} border inline-block p-4 rounded my-1 max-w-[50%] break-words`}>
                {message.content}
              </div>
            )
          }
          {
            message.messageType === "file" && (
              <div className={`${message.sender !== selectedChatData._id ? "bg-[#8417ff]/5 text-[#8417ff]/90 border-[#8417ff]/50" : "bg-[#2a2b33]/5 text-white/80 border-[#ffffff]/20"} border inline-block p-4 rounded my-1 max-w-[50%] break-words`}>
                {
                  checkIfImage(message?.fileUrl ?? "") ? (
                    <div className="cursor-pointer" onClick={() => {setShowImage(true); setImageUrl(`${message.fileUrl}`)}}>
                      <img src={`${HOST}/${message.fileUrl}`} height={300} width={300} />
                    </div>
                  ) : (
                    <div className="flex items-center justify-center gap-4">
                      <span className="text-white/8 text-3xl bg-black/20 rounded-full p-3">
                        <MdFolderZip />
                      </span>
                      <span>{message.fileUrl && message.fileUrl.split('/').pop()}</span>
                      <span className="bg-black/20 p-3 text-2xl rounded-full hover:bg-black/50 cursor-pointer transition-all duration-300" onClick={() => downloadFile(message.fileUrl ?? "")}>
                        <IoArrowDown />
                      </span>
                    </div>
                  )
                }
              </div>
            )
          }
          <div className="text-xs text-gray-600">{moment(message.timestamp).format('LT')}</div>
        </div>
      }
    </>
  )

  const renderChannelMessages = (message: ChannelMessage) => {
    return (
    <>
      {
        userInfo &&
        <div className={`mt-5 ${message.sender._id !== userInfo.id ? 'text-left' : 'text-right'}`}>
          {
            message.messageType === "text" && (
              <div className={`${message.sender._id === userInfo.id ? "bg-[#8417ff]/5 text-[#8417ff]/90 border-[#8417ff]/50" : "bg-[#2a2b33]/5 text-white/80 border-[#ffffff]/20"} border inline-block p-4 rounded my-1 max-w-[50%] break-words ml-9`}>
                {message.content}
              </div>
            )
          }
          {
            message.messageType === "file" && (
              <div className={`${message.sender._id === userInfo.id ? "bg-[#8417ff]/5 text-[#8417ff]/90 border-[#8417ff]/50" : "bg-[#2a2b33]/5 text-white/80 border-[#ffffff]/20"} border inline-block p-4 rounded my-1 max-w-[50%] break-words`}>
                {
                  checkIfImage(message.fileUrl ?? "") ? (
                    <div className="cursor-pointer" onClick={() => {setShowImage(true); setImageUrl(`${message.fileUrl}`)}}>
                      <img src={`${HOST}/${message.fileUrl}`} height={300} width={300} />
                    </div>
                  ) : (
                    <div className="flex items-center justify-center gap-4">
                      <span className="text-white/8 text-3xl bg-black/20 rounded-full p-3">
                        <MdFolderZip />
                      </span>
                      <span>{message.fileUrl && message.fileUrl.split('/').pop()}</span>
                      <span className="bg-black/20 p-3 text-2xl rounded-full hover:bg-black/50 cursor-pointer transition-all duration-300" onClick={() => downloadFile(message.fileUrl ?? "")}>
                        <IoArrowDown />
                      </span>
                    </div>
                  )
                }
              </div>
            )
          }
          {
            message.sender._id !== userInfo.id ? (
              <div className="flex items-center justify-start gap-3">
                <Avatar className="h-8 w-8 rounded-full overflow-hidden">
                  {
                    message.sender.image && (
                      <AvatarImage src={`${HOST}/${message.sender.image}`} alt="profile" className="object-cover w-full h-full bg-black" />
                    )
                  }
                  <AvatarFallback className={`uppercase h-8 w-8 text-lg flex items-center justify-center rounded-full ${getColors(message.sender.color)}`}>
                    {message.sender.firstName ? message.sender.firstName.split("").shift() : message.sender.email.split("").shift()}
                  </AvatarFallback>
                </Avatar>
                <span className="text-sm text-white/60">{`${message.sender.firstName} ${message.sender.lastName}`}</span>
                <span className="text-sm text-white/60">{moment(message.timestamp).format("LT")}</span>
              </div>
            ) :(
              <div className="text-sm text-white/60 mt-1">
                {moment(message.timestamp).format("LT")}
              </div>
            )
          }
        </div>
      }
    </>
  )}

  return (
    <div className="flex-1 overflow-y-auto scrollbar-hidden p-4 md:w-[65vw] lg:w-[70vw] xl:w-[80vw] w-full">
      {renderMessages()}
      <div ref={(el) => { scrollRef.current = el }} />
      {
        showImage && <div className="fixed z-[1000] top-0 left-0 h-[100vh] w-[100vw] flex items-center justify-center backdrop-blur-lg flex-col">
          <div>
            <img src={`${HOST}/${imageUrl}`} className="h-[80vh] w-full bg-cover" alt="" />
          </div>
          <div className="flex gap-5 fixed top-0 mt-5">
            <button 
              className="bg-black/20 p-3 text-2xl rounded-full hover:bg-black/50 cursor-pointer transition-all duration-300"
              onClick={() => downloadFile(imageUrl)}
            >
              <IoArrowDown />
            </button>
            <button 
              className="bg-black/20 p-3 text-2xl rounded-full hover:bg-black/50 cursor-pointer transition-all duration-300"
              onClick={() => {setShowImage(false); setImageUrl('')}}
            >
              <IoCloseSharp />
            </button>
          </div>
        </div>
      }
    </div>
  );
};

export default MessageContainer;
