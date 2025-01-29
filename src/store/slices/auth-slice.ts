import { UserInfo } from "@/types/get-user-info.type";
import { StateCreator } from "zustand";

export type AuthSlice = {
    userInfo: UserInfo | undefined | null; 
    setUserInfo: (userInfo: UserInfo | undefined | null) => void;
};


export const createAuthSlice: StateCreator<AuthSlice> = (set: (partial: Partial<AuthSlice>) => void): AuthSlice => ({
    userInfo: undefined,
    setUserInfo: (userInfo) => set({ userInfo })
})