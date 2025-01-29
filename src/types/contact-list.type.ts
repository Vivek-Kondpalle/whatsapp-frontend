import { DmContact } from "./get-dm-contact.type";
import { Channel } from "./get-user-channels.type";

export type ContactListProps =
  | { contacts: DmContact[]; isChannel?: false } // When isChannel is false or undefined, contacts are DmContact[]
  | { contacts: Channel[]; isChannel: true };
