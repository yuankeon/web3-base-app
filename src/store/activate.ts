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
  setActivationState: (state: ActivationState) => void
}

export const useActivateStore = create<Activate>((set) => ({
  activationState: IDLE_ACTIVATION_STATE,
  setActivationState: (state: ActivationState) =>
    set({ activationState: state }),
}))
