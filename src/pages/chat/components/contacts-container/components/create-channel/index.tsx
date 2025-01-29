import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
  } from "@/components/ui/tooltip";
  import { useEffect, useState } from "react";
  import { FaPlus } from "react-icons/fa";
  import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
  } from "@/components/ui/dialog";
  import { apiClient } from "@/lib/api-client";
  import { CREATE_CHANNEL_ROUTE, GET_ALL_CONTACTS_ROUTE } from "@/utils/constants";
  import { useAppStore } from "@/store";
import { Button } from "@/components/ui/button";
import MultipleSelector, { Option } from "@/components/ui/multiselect";
import { GetAllContactsResponse, GetContact } from "@/types/get-all-contacts.type";
import { CreateChannelRequest, CreateChannelResponse } from "@/types/create-channel.type";
  
  const CreateChannel = () => {
    const { addChannel } = useAppStore()

    const [newChannelModal, setNewChannelModal] = useState(false);
    const [allContacts, setAllContacts] = useState<GetContact[]>([]);
    const [selectedContacts, setSelectedContacts] = useState<Option[]>([]);
    const [channelName, setChannelName] = useState("");
    

    useEffect(() => {
      const getData = async () => {
        const response = await apiClient.get<GetAllContactsResponse>(GET_ALL_CONTACTS_ROUTE, {withCredentials: true});
        setAllContacts(response.data.contacts);
      }

      getData()
    }, [])
  
    const createChannel = async () => {
      try {
        if(selectedContacts.length > 0 && channelName.length > 0){
          const payload: CreateChannelRequest = {
            name: channelName,
            members: selectedContacts.map(contact => contact.value)
          }

          const response = await apiClient.post<CreateChannelResponse>(CREATE_CHANNEL_ROUTE, payload, {withCredentials: true});

          if(response.status === 201){
            setChannelName("");
            setSelectedContacts([]);
            setNewChannelModal(false);
            addChannel(response.data.channel);
          }
        }
      } catch (error) {
        console.log(error);
      }
    }
  
    return (
      <>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger className="p-2">
              <FaPlus
                className="text-neutral-400 font-light text-opacity-90 text-start hover:text-neutral-100 cursor-pointer transition-all duration-300"
                onClick={() => setNewChannelModal(true)}
              />
            </TooltipTrigger>
            <TooltipContent className="bg-[#1c1b1e] border-none mb-2 p-3 text-white">
              Select New Contact
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        <Dialog open={newChannelModal} onOpenChange={setNewChannelModal}>
          <DialogContent className="bg-[#181920] border-none text-white w-[400px] h-[400px] flex flex-col">
            <DialogHeader>
              <DialogTitle>Please select a contact</DialogTitle>
            </DialogHeader>
            <div>
              <input
                type="text"
                placeholder="Channel Name"
                className="rounded-lg p-6 bg-[#2c2e3b] border-none w-full"
                onChange={(e) => setChannelName(e.target.value)}
                value={channelName}
              />
            </div>
            <div>
              <MultipleSelector 
                className="rounded-lg bg-[#2c2e3b] border-none py-2 text-white" 
                defaultOptions={allContacts}
                placeholder="Select Contacts"
                value={selectedContacts}
                onChange={setSelectedContacts}
                emptyIndicator={
                  <p className="text-center text-lg leading-10 text-gray-600">No results found</p>
                }
              />
            </div>
             <div>
              <Button className="w-full bg-purple-700 hover:bg-purple-900 transition-all duration-300" onClick={createChannel}>Create Channel</Button>
            </div>
          </DialogContent>
        </Dialog>
      </>
    );
  };
  
  export default CreateChannel;
  