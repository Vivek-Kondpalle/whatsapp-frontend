import { UserInfo } from "@/types/get-user-info.type";
import { StateCreator } from "zustand";

export type AuthSlice = {
    userInfo: UserInfo | undefined; 
    setUserInfo: (userInfo: UserInfo | undefined) => void;
};


export const createAuthSlice: StateCreator<AuthSlice> = (set: (partial: Partial<AuthSlice>) => void): AuthSlice => ({
    userInfo: undefined,
    setUserInfo: (userInfo) => set({ userInfo })
})