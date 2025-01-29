import { BaseContact } from "./base-contact.type";

export type DmContact = BaseContact & {
  lastMessageTime?: string; // ISO string format
};

export type GetDmContactTypeResponse = {
  contacts: DmContact[];
};
