import { Connection } from '@/types/wallet'
import { didUserReject } from '@/utils/utils'
import { useCallback, useEffect } from 'react'
import {
  ActivationStatus,
  IDLE_ACTIVATION_STATE,
  useActivateStore,
} from '@/store/activate'
import { useUserStore } from '@/store'
import { getConnection } from '@/connectors'
import { Connector } from '@web3-react/types'

function useTryActivation() {
  const setActivationState = useActivateStore(
    (state) => state.setActivationState,
  )
  const setWallet = useUserStore((state) => state.setWallet)

  return useCallback(async (connection: Connection, onSuccess: () => void) => {
    // Skips wallet connection if the connection should override the default
    // behavior, i.e. install MetaMask or launch Coinbase app => 打开外链
    if (connection.overrideActivate?.()) return

    try {
      setActivationState({ status: ActivationStatus.PENDING, connection })

      console.debug(`Connection activating: ${connection.getName()}`)
      await connection.connector.activate()

      console.debug(`Connection activated: ${connection.getName()}`)
      setWallet(connection.type)

      // Clears pending connection state
      setActivationState(IDLE_ACTIVATION_STATE)

      onSuccess()
    } catch (error) {
      // Gracefully handles errors from the user rejecting a connection attempt
      if (didUserReject(connection, error)) {
        setActivationState(IDLE_ACTIVATION_STATE)
        return
      }

      // TODO(WEB-1859): re-add special treatment for already-pending injected errors & move debug to after didUserReject() check
      console.debug(`Connection failed: ${connection.getName()}`)
      console.error(error)

      setActivationState({ status: ActivationStatus.ERROR, connection, error })
    }
  }, [])
}

//取消钱包连接
function useCancelActivation() {
  const [activationState, setActivationState] = useActivateStore((state) => [
    state.activationState,
    state.setActivationState,
  ])
  return () => {
    if (activationState.status !== ActivationStatus.IDLE)
      activationState.connection.connector.deactivate?.()
    setActivationState(IDLE_ACTIVATION_STATE)
  }
}

export function useConnectWallet() {
  const activationState = useActivateStore((state) => state.activationState)
  const tryActivation = useTryActivation()
  const cancelActivation = useCancelActivation()
  return { tryActivation, activationState, cancelActivation }
}

async function connect(connector: Connector) {
  try {
    if (connector.connectEagerly) {
      await connector.connectEagerly()
    } else {
      await connector.activate()
    }
  } catch (error) {
    console.debug(`web3-react eager connection error: ${error}`)
  }
}

//从缓存中读取上次选择的插件钱包 -> 主动连接
// attempt to connect eagerly on mount
export function useEagerlyConnect() {
  const [wallet, setWallet] = useUserStore((state) => [
    state.wallet,
    state.setWallet,
  ])

  let selectedConnection: Connection | undefined

  if (wallet) {
    try {
      selectedConnection = getConnection(wallet)
    } catch {
      setWallet(undefined)
    }
  }

  useEffect(() => {
    if (selectedConnection) {
      connect(selectedConnection.connector)
    } // The dependency list is empty so this is only run once on mount
  }, []) // eslint-disable-line react-hooks/exhaustive-deps
}
