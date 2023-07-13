import { Connection } from '@/types/wallet'
import { SvgIcon } from './SvgIcon'
import { useUserStore } from '@/store'
import './css/wallet.css'

export function WalletOption({ connection }: { connection: Connection }) {
  const darkMode = useUserStore((state) => state.darkMode)

  return (
    <div className="wallet-option">
      <div className="wallet-img">
        <SvgIcon
          iconName={connection.getIcon?.(darkMode) as string}
          width="40px"
          height="40px"
          borderRadius="12px"
        />
      </div>
    </div>
  )
}
