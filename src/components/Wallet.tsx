import { Drawer } from 'antd'

export function WalletDrawer({
  onClose,
  open,
}: {
  open: boolean
  onClose: () => void
}) {
  return (
    <Drawer
      title="Connect a wallet"
      placement="right"
      onClose={onClose}
      open={open}
    >
      <p>metamask...</p>
      <p>coinbase...</p>
      <p>wallet connect...</p>
    </Drawer>
  )
}
