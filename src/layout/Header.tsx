import { Avatar } from '@/components/Avatar'
import { getShortAddress } from '@/utils'
import { Button, Tooltip, message } from 'antd'
import { useWeb3React } from '@web3-react/core'
import { useEffect, useState } from 'react'
import { SvgIcon } from '@/components/SvgIcon'
import { getNonce, postToken, getUserInfo } from '@/api/user'
import { useWeb3Data } from '@/hooks/useWeb3Data'
import { useUserStore } from '@/store'
import { WalletDrawer } from '@/components/Wallet'
import { useActivateStore } from '@/store/activate'
import { getConnection } from '@/connectors'

export function Header() {
  const { account, isActive, connector } = useWeb3React()
  const [loading, setLoading] = useState(false)
  const { signPersonalData } = useWeb3Data()
  const [messageApi, contextHolder] = message.useMessage()

  //当前连接的钱包
  const connection = getConnection(connector)

  const [userData, setUserData, darkMode, setDarkMode, setWallet] =
    useUserStore((state) => [
      state.userData,
      state.setUserData,
      state.darkMode,
      state.setDarkMode,
      state.setWallet,
    ])

  const [accountDrawerOpen, toggleAccountDrawerOpen] = useActivateStore(
    (state) => [state.accountDrawerOpen, state.toggleAccountDrawerOpen],
  )

  const resetUserInfo = () => {
    localStorage.removeItem('token')
    setUserData(undefined)
  }

  useEffect(() => {
    //用户直接切换账号
    const ethereum = window.ethereum
    if (ethereum && isActive) {
      const handleAccountsChanged = () => {
        console.log('account changed')
        resetUserInfo()
      }
      ethereum.on('accountsChanged', handleAccountsChanged)
      return () => {
        ethereum.removeListener('accountsChanged', handleAccountsChanged)
      }
    }
    return undefined
  }, [isActive])

  //钱包断开连接
  const disconnect = () => {
    if (userData) {
      resetUserInfo()
    }
    if (connector && connector.deactivate) {
      connector.deactivate()
    }
    connector.resetState()
    setWallet(undefined)
  }

  const initUserInfo = async () => {
    getUserInfo()
      .then((userResult) => {
        setUserData(userResult.data)
      })
      .catch((error: Error) => {
        messageApi.error(error.message)
      })
  }

  //刷新页面使用缓存 token 去请求用户信息
  useEffect(() => {
    if (account && localStorage.getItem('token')) {
      initUserInfo()
    }
  }, [account])

  const handleLogin = async () => {
    if (!account) {
      messageApi.error('Failed to connect to wallet')
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
      messageApi.error((error as Error).message)
    }
  }

  //监听当前的darkMode，动态切换样式
  useEffect(() => {
    const html = document.querySelector('html')
    if (darkMode) {
      html?.classList.add('dark')
    } else {
      html?.classList.remove('dark')
    }
  }, [darkMode])

  const toggleTheme = () => {
    setDarkMode()
  }

  const handleCopy = async (toCopy: string) => {
    await navigator.clipboard.writeText(toCopy)
    messageApi.success('Copied to clipboard~')
  }

  return (
    <div className="header">
      {contextHolder}
      <WalletDrawer
        open={accountDrawerOpen}
        onClose={toggleAccountDrawerOpen}
      />
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
          <Tooltip placement="bottom" title={`Disconnect`}>
            <Button className="mode" onClick={disconnect}>
              <SvgIcon iconName={'logout'} width="20px" height="20px" />
            </Button>
          </Tooltip>
          {connection.getName()}:
          <Tooltip placement="bottom" title={'Copy'}>
            <div className="header-account" onClick={() => handleCopy(account)}>
              <div className="header-account-icon">
                <Avatar account={account} />
              </div>
              <span>{getShortAddress(account)}</span>
            </div>
          </Tooltip>
          {!userData ? (
            <Button type="primary" onClick={handleLogin} loading={loading}>
              Login
            </Button>
          ) : (
            <div className="header-wallet">
              <span style={{ marginLeft: 8 }}>Proxy:</span>
              <Tooltip placement="bottom" title={'Copy'}>
                <div
                  className="header-account"
                  onClick={() => handleCopy(userData.proxyAddress)}
                >
                  <div className="header-account-icon">
                    <Avatar account={userData.proxyAddress} />
                  </div>
                  <span>{getShortAddress(userData.proxyAddress)}</span>
                </div>
              </Tooltip>
            </div>
          )}
        </div>
      ) : (
        <Button type="primary" onClick={toggleAccountDrawerOpen} size="large">
          Connect Wallet
        </Button>
      )}
    </div>
  )
}
