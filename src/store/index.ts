import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { UserData } from '@/types/app'
import { Wallet } from '@/types/wallet'

type Store = {
  userData: UserData
  darkMode: boolean
  wallet: Wallet
  setUserData: (data: UserData) => void
  setDarkMode: () => void
  setWallet: (wallet: Wallet) => void
}

export const useUserStore = create<Store>()(
  persist(
    (set) => ({
      userData: undefined,
      darkMode: false,
      wallet: undefined,
      setUserData: (data: UserData) => set({ userData: data }),
      setWallet: (wallet) => set({ wallet: wallet }),
      setDarkMode: () => set((state) => ({ darkMode: !state.darkMode })),
    }),
    {
      name: 'user',
      partialize: (state) => ({
        darkMode: state.darkMode,
        wallet: state.wallet,
      }),
    },
  ),
)
