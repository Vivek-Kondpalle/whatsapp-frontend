import { create } from 'zustand';
import { createAuthSlice } from './slices/auth-slice';
import { createChatSlice } from './slices/chat-slice';

import type { AuthSlice } from './slices/auth-slice';

type Store = AuthSlice & ReturnType<typeof createChatSlice>;

export const useAppStore = create<Store>()((...a) => ({
  ...createAuthSlice(...a),
  ...createChatSlice(...a)
}));
