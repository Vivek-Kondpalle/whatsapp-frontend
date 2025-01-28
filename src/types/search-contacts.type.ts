// Request type for searching contacts
export type SearchContactsRequest = {
  searchTerm: string;
};

// Type for each contact in the response
export type Contact = {
  _id: string;
  email: string;
  profileSetup: boolean;
  image?: string;
  firstName?: string;
  lastName?: string;
  color?: number;
  __v: number;
};

// Response type for search contacts
export type SearchContactsResponse = {
  contacts: Contact[];
};
