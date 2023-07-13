import { getConnections } from '@/connectors'
import { Drawer } from 'antd'
import { WalletOption } from './WalletOption'

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
      {connections.map((connection) => (
        <WalletOption key={connection.getName()} connection={connection} />
      ))}
    </Drawer>
  )
}
