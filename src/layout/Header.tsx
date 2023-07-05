import { Avatar } from '@/components/Avatar'
import { getName, getShortAddress } from '@/utils'
import { Button, message } from 'antd'
import { useWeb3React } from '@web3-react/core'
import { metaMask } from '@/connectors/metaMask'
import { useEffect } from 'react'

export function Header() {
  const { account } = useWeb3React()

  // attempt to connect eagerly on mount 刷新页面保持连接
  useEffect(() => {
    void metaMask.connectEagerly().catch(() => {
      console.debug('Failed to connect eagerly to metamask')
    })
  }, [])

  const connectWallet = () => {
    metaMask.activate().catch(() => {
      message.error('Failed to connect eagerly to metamask')
    })
  }

  return (
    <div className="header">
      <img src="/pic.jpg" alt="" className="logo" />
      {account ? (
        <div className="header-wallet">
          {getName(metaMask)}:
          <div className="header-account">
            <div className="header-account-icon">
              <Avatar account={account} />
            </div>
            <span>{getShortAddress(account)}</span>
          </div>
        </div>
      ) : (
        <Button type="primary" onClick={connectWallet} size="large">
          Connect Wallet
        </Button>
      )}
    </div>
  )
}
