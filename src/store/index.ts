import { create } from 'zustand'
import { UserData } from '@/types/app'

type Store = {
  userData: UserData
  setUserData: (data: UserData) => void
}

export const useUserStore = create<Store>((set) => ({
  userData: undefined,
  setUserData: (data: UserData) => set({ userData: data }),
}))
