export type Channel = {
  _id: string;
  name: string;
  members: string[];
  admin: string;
  messages: string[];
  createdAt: string; // ISO timestamp
  updatedAt: string; // ISO timestamp
  __v: number;
};

export type GetUserChannelsResponse = {
  channels: Channel[];
};
