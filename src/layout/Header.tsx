import { Avatar } from '@/components/Avatar'
import { getName, getShortAddress } from '@/utils'
import { Button, Tooltip, message } from 'antd'
import { useWeb3React } from '@web3-react/core'
import { metaMask } from '@/connectors/metaMask'
import { useEffect, useState } from 'react'
import { SvgIcon } from '@/components/SvgIcon'
import { getNonce, postToken, getUserInfo } from '@/api/user'
import { useWeb3Data } from '@/hooks/useWeb3Data'
import { useUserStore } from '@/store'

export function Header() {
  const { account, isActive } = useWeb3React()
  const [loading, setLoading] = useState(false)
  const { signPersonalData } = useWeb3Data()
  const [userData, setUserData, darkMode, setDarkMode] = useUserStore(
    (state) => [
      state.userData,
      state.setUserData,
      state.darkMode,
      state.setDarkMode,
    ],
  )

  useEffect(() => {
    //用户直接切换账号
    const ethereum = window.ethereum
    if (ethereum && isActive) {
      const handleAccountsChanged = () => {
        console.log('account changed')
        localStorage.removeItem('token')
        setUserData(undefined)
      }
      ethereum.on('accountsChanged', handleAccountsChanged)
      return () => {
        ethereum.removeListener('accountsChanged', handleAccountsChanged)
      }
    }
    return undefined
  }, [isActive])

  // attempt to connect eagerly on mount 刷新页面保持连接
  useEffect(() => {
    void metaMask.connectEagerly().catch(() => {
      message.warning('Failed to connect eagerly to metamask')
    })
  }, [])

  const initUserInfo = async () => {
    getUserInfo()
      .then((userResult) => {
        setUserData(userResult.data)
      })
      .catch((error: Error) => {
        message.error(error.message)
      })
  }

  //刷新页面使用缓存 token 去请求用户信息
  useEffect(() => {
    if (account && localStorage.getItem('token')) {
      initUserInfo()
    }
  }, [account])

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

  const toggleTheme = () => {
    const html = document.querySelector('html')
    if (darkMode) {
      html?.classList.remove('dark')
    } else {
      html?.classList.add('dark')
    }
    setDarkMode()
  }

  return (
    <div className="header">
      <img src="/pic.jpg" alt="" className="logo" />
      <div style={{ flexGrow: 1 }} />
      <Tooltip
        placement="bottom"
        title={`turn ${darkMode ? 'on' : 'off'} the light`}
      >
        <Button className="mode" onClick={toggleTheme}>
          <SvgIcon
            iconName={darkMode ? 'dark' : 'light'}
            width="20px"
            height="20px"
          />
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
              <span style={{ marginLeft: 8 }}>Proxy:</span>
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
