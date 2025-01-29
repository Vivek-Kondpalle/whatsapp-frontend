import { BaseContact } from "./base-contact.type";

// Request type for searching contacts
export type SearchContactsRequest = {
  searchTerm: string;
};

// Type for each contact in the response
export type Contact = BaseContact & {
  profileSetup: boolean;
  __v: number;
};

// Response type for search contacts
export type SearchContactsResponse = {
  contacts: Contact[];
};
