import { StateCreator } from "zustand";

type UserInfo = {
    id: string;
    email: string;
    profileSetup: boolean;
    firstName: string;
    lastName: string;
    color: number;
}

export type AuthSlice = {
    userInfo: UserInfo | undefined; 
    setUserInfo: (userInfo: UserInfo | undefined) => void;
};


export const createAuthSlice: StateCreator<AuthSlice> = (set: (partial: Partial<AuthSlice>) => void): AuthSlice => ({
    userInfo: undefined,
    setUserInfo: (userInfo) => set({ userInfo })
})