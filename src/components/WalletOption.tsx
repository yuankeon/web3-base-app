import { Connection } from '@/types/wallet'
import { SvgIcon } from './SvgIcon'
import { useUserStore } from '@/store'
import { useConnectWallet } from '@/hooks/useConnectWallet'
import { ActivationStatus, useActivateStore } from '@/store/activate'
import { Spin } from 'antd'

export function WalletOption({ connection }: { connection: Connection }) {
  const darkMode = useUserStore((state) => state.darkMode)
  const { activationState, tryActivation } = useConnectWallet()

  const toggleAccountDrawerOpen = useActivateStore(
    (state) => state.toggleAccountDrawerOpen,
  )

  const activate = () => tryActivation(connection, toggleAccountDrawerOpen)

  //存在正在连接的钱包
  const isSomeOptionPending =
    activationState.status === ActivationStatus.PENDING
  const isCurrentOptionPending =
    isSomeOptionPending && activationState.connection.type === connection.type

  return (
    <div className="wallet-wrapper" onClick={activate}>
      <div className="wallet-left">
        <div className="wallet-img">
          <SvgIcon
            iconName={connection.getIcon?.(darkMode) as string}
            width="40px"
            height="40px"
            borderRadius="12px"
          />
        </div>
        <span className="wallet-name">{connection.getName()}</span>
      </div>
      {isCurrentOptionPending && <Spin />}
    </div>
  )
}
