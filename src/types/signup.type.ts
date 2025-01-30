import { UserInfo } from './get-user-info.type';

// Request type for signup
export type SignupRequest = {
  email: string;
  password: string;
};

// Response type for signup
export type SignupResponse = {
  user: Pick<UserInfo, 'id' | 'email' | 'profileSetup'>;
};
