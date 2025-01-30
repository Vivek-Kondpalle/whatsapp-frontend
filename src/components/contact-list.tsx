import { useAppStore } from '@/store';
import { Avatar, AvatarImage } from './ui/avatar';
import { HOST } from '@/utils/constants';
import { getColors } from '@/lib/utils';
import React from 'react';
import { DmContact } from '@/types/get-dm-contact.type';
import { Channel } from '@/types/get-user-channels.type';
import { ContactListProps } from '@/types/contact-list.type';

// Type Guard Function to determine if the contact is a DmContact
const isDmContact = (contact: DmContact | Channel): contact is DmContact => {
  return 'firstName' in contact && 'lastName' in contact && 'email' in contact;
};

// Contact Avatar Component
const ContactAvatar: React.FC<{ contact: DmContact }> = ({ contact }) => {
  return (
    <Avatar className="h-10 w-10 rounded-full overflow-hidden">
      {contact.image ? (
        <AvatarImage
          src={`${HOST}/${contact.image}`}
          alt="profile"
          className="object-cover w-full h-full bg-black"
        />
      ) : (
        <div
          className={`uppercase h-10 w-10 text-lg border-[1px] flex justify-center items-center ${getColors(
            contact.color
          )}`}
        >
          {contact.firstName ? contact.firstName.charAt(0) : contact.email.charAt(0)}
        </div>
      )}
    </Avatar>
  );
};

const ContactList: React.FC<ContactListProps> = ({ contacts, isChannel = false }) => {
  const { setSelectedChatData, setSelectedChatMessages, setSelectedChatType, selectedChatData } =
    useAppStore();

  const handleClick = (contact: DmContact | Channel) => {
    setSelectedChatType(isChannel ? 'channel' : 'contact');
    setSelectedChatData(contact);

    if (selectedChatData && selectedChatData._id !== contact._id) {
      setSelectedChatMessages([]);
    }
  };

  return (
    <div className="mt-5">
      {contacts.map((contact) => (
        <div
          key={contact._id}
          className={`pl-10 py-2 transition-all duration-300 cursor-pointer ${
            selectedChatData && selectedChatData._id === contact._id
              ? ' bg-[#8417ff] hover:bg-[#8417ff]'
              : 'hover:bg-[#f1f1f111]'
          }`}
          onClick={() => handleClick(contact)}
        >
          <div className="flex gap-5 items-center justify-start text-neutral-300">
            {!isChannel && isDmContact(contact) && <ContactAvatar contact={contact} />}
            {isChannel && (
              <div className="bg-[#ffffff22] h-10 w-10 flex items-center justify-center rounded-full">
                #
              </div>
            )}
            <span>
              {isDmContact(contact)
                ? contact.firstName && contact.lastName
                  ? `${contact.firstName} ${contact.lastName}`
                  : contact.email
                : contact.name}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ContactList;
