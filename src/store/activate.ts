import { create } from 'zustand'
import { Connection } from '@/types/wallet'

export enum ActivationStatus {
  PENDING,
  ERROR,
  IDLE,
}

type ActivationPendingState = {
  status: ActivationStatus.PENDING
  connection: Connection
}
type ActivationErrorState = {
  status: ActivationStatus.ERROR
  connection: Connection
  error: any
}
export const IDLE_ACTIVATION_STATE = { status: ActivationStatus.IDLE } as const
type ActivationState =
  | ActivationPendingState
  | ActivationErrorState
  | typeof IDLE_ACTIVATION_STATE

interface Activate {
  activationState: ActivationState
  accountDrawerOpen: boolean //打开和关闭侧边菜单
  setActivationState: (state: ActivationState) => void
  toggleAccountDrawerOpen: () => void
}

export const useActivateStore = create<Activate>((set) => ({
  activationState: IDLE_ACTIVATION_STATE,
  accountDrawerOpen: false,
  setActivationState: (state: ActivationState) =>
    set({ activationState: state }),
  toggleAccountDrawerOpen: () =>
    set((state) => ({ accountDrawerOpen: !state.accountDrawerOpen })),
}))
