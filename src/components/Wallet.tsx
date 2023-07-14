import { getConnections } from '@/connectors'
import { Drawer } from 'antd'
import { WalletOption } from './WalletOption'
import './css/wallet.css'

export function WalletDrawer({
  onClose,
  open,
}: {
  open: boolean
  onClose: () => void
}) {
  const connections = getConnections()

  return (
    <Drawer
      title="Connect a wallet"
      placement="right"
      onClose={onClose}
      open={open}
    >
      <div className="option-grid">
        {connections.map((connection) => (
          <WalletOption key={connection.getName()} connection={connection} />
        ))}
      </div>
    </Drawer>
  )
}
