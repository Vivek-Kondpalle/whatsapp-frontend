import { Channel } from './get-user-channels.type';

export type CreateChannelRequest = {
  name: string;
  members: string[];
};

export type CreateChannelResponse = {
  channel: Channel;
};
