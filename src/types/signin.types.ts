import { UserInfo } from './get-user-info.type';

export type SigninRequest = {
  email: string;
  password: string;
};

export type SigninResponse = {
  user: UserInfo;
};
