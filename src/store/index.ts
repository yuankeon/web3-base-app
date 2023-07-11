import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { UserData } from '@/types/app'

type Store = {
  userData: UserData
  darkMode: boolean
  setUserData: (data: UserData) => void
  setDarkMode: () => void
}

export const useUserStore = create<Store>()(
  persist(
    (set) => ({
      userData: undefined,
      darkMode: false,
      setUserData: (data: UserData) => set({ userData: data }),
      setDarkMode: () => set((state) => ({ darkMode: !state.darkMode })),
    }),
    {
      name: 'user',
      partialize: (state) => ({ darkMode: state.darkMode }),
    },
  ),
)
