export type DmContact = {
  _id: string;
  lastMessageTime: string; // ISO string format
  email: string;
  firstName: string;
  lastName: string;
  color: number;
};

export type GetDmContactTypeResponse = {
  contacts: DmContact[];
};
