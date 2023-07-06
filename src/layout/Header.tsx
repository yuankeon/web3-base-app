import { Avatar } from '@/components/Avatar'
import { getName, getShortAddress } from '@/utils'
import { Button, Tooltip, message } from 'antd'
import { useWeb3React } from '@web3-react/core'
import { metaMask } from '@/connectors/metaMask'
import { useEffect, useState } from 'react'
import { SvgIcon } from '@/components/SvgIcon'
import { AccountData } from '@/types/app'
import { getNonce, postToken, getUserInfo } from '@/api/user'
import { useWeb3Data } from '@/hooks/useWeb3Data'

export function Header() {
  const { account } = useWeb3React()
  const [userData, setUserData] = useState<AccountData>()
  const [loading, setLoading] = useState(false)
  const { signPersonalData } = useWeb3Data()

  // attempt to connect eagerly on mount 刷新页面保持连接
  useEffect(() => {
    void metaMask.connectEagerly().catch(() => {
      message.warning('Failed to connect eagerly to metamask')
    })
  }, [])

  const connectWallet = () => {
    metaMask.activate().catch(() => {
      message.error('Failed to connect to metamask')
    })
  }

  const handleLogin = async () => {
    if (!account) {
      message.error('Failed to connect to metamask')
      return
    }
    setLoading(true)
    try {
      const nonceResult = await getNonce(account)
      const text = `Sign in with DEFED Distributed Digital Identity. Nonce:${nonceResult.data.nonce}`
      const signature = await signPersonalData(text)
      const tokenResult = await postToken(account, signature)
      //缓存 jwt token 信息
      localStorage.setItem('token', tokenResult.data.jwt)
      //请求用户信息
      const userResult = await getUserInfo()
      setLoading(false)
      setUserData(userResult.data)
    } catch (error) {
      setLoading(false)
      message.error((error as Error).message)
    }
  }

  return (
    <div className="header">
      <img src="/pic.jpg" alt="" className="logo" />
      <div style={{ flexGrow: 1 }} />
      <Tooltip placement="bottom" title={'turn off the light'}>
        <Button className="mode">
          {/* dark */}
          <SvgIcon iconName="light" width="20px" height="20px" />
        </Button>
      </Tooltip>

      {account ? (
        <div className="header-wallet">
          {getName(metaMask)}:
          <div className="header-account">
            <div className="header-account-icon">
              <Avatar account={account} />
            </div>
            <span>{getShortAddress(account)}</span>
          </div>
          {!userData ? (
            <Button type="primary" onClick={handleLogin} loading={loading}>
              Login
            </Button>
          ) : (
            <div className="header-wallet">
              <span>Proxy:</span>
              <div className="header-account">
                <div className="header-account-icon">
                  <Avatar account={userData.proxyAddress} />
                </div>
                <span>{getShortAddress(userData.proxyAddress)}</span>
              </div>
            </div>
          )}
        </div>
      ) : (
        <Button type="primary" onClick={connectWallet} size="large">
          Connect Wallet
        </Button>
      )}
    </div>
  )
}
