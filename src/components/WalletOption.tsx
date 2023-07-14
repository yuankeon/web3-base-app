import { Connection } from '@/types/wallet'
import { SvgIcon } from './SvgIcon'
import { useUserStore } from '@/store'

export function WalletOption({ connection }: { connection: Connection }) {
  const darkMode = useUserStore((state) => state.darkMode)

  return (
    <div className="wallet-wrapper">
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
  )
}
