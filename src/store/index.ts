import { create } from 'zustand'
import { UserData } from '@/types/app'

type Store = {
  userData: UserData
  darkMode: boolean
  setUserData: (data: UserData) => void
  setDarkMode: () => void
}

export const useUserStore = create<Store>((set) => ({
  userData: undefined,
  darkMode: false,
  setUserData: (data: UserData) => set({ userData: data }),
  setDarkMode: () => set((state) => ({ darkMode: !state.darkMode })),
}))
