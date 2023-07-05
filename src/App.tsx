import './App.css'
import { getTokens } from '@/api/approve'
import { SvgIcon } from '@/components/SvgIcon'
import { Button, message, Input, Divider } from 'antd'
import { useEffect, useState } from 'react'
import { useWeb3React } from '@web3-react/core'
import { metaMask } from '@/connectors/metaMask'
import { Avatar } from '@/components/Avatar'
import { getName, getShortAddress, reduceData } from '@/utils'
import { PairItem } from '@/types/app'
import { TokenMaps, TITLE } from '@/config'

function App() {
  const { account } = useWeb3React()

  // attempt to connect eagerly on mount 刷新页面保持连接
  useEffect(() => {
    void metaMask.connectEagerly().catch(() => {
      console.debug('Failed to connect eagerly to metamask')
    })
  }, [])

  const [pairList, setPairList] = useState<PairItem[] | undefined>()

  useEffect(() => {
    function getPairList() {
      getTokens()
        .then((res) => {
          if (res.code === 200) {
            const data = reduceData(res.data)
            setPairList(data)
          } else {
            throw new Error('请求成功了, 但code不为200')
          }
        })
        .catch((error: Error) => {
          message.error({
            content: error.message,
          })
        })
    }
    getPairList()
  }, [])

  const connectWallet = () => {
    metaMask.activate().catch(() => {
      message.error('Failed to connect eagerly to metamask')
    })
  }

  return (
    <>
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

      <div className="container">
        <div className="card">
          <div className="form-item">
            <span>当前环境:</span>
            <span>DEV</span>
          </div>

          <div className="form-item">
            <span>授权合约:</span>
            <Input style={{ width: '80%' }} />
          </div>
          <Divider plain>Token List</Divider>

          <div className="list-title">
            {TITLE.map((item) => (
              <div key={item.title} style={{ width: item.width }}>
                {item.title}
              </div>
            ))}
          </div>

          <div className="pair-content">
            {!pairList
              ? 'loading...'
              : pairList.map((item) => (
                  <div key={item.tokenAddress} className="pair-list">
                    <SvgIcon
                      iconName={TokenMaps[item.tokenName]}
                      width="20px"
                      height="20px"
                    />
                    <span>{item.symbol}</span>
                  </div>
                ))}
          </div>
        </div>
        <a href="https://github.com/yuankeon/web3-base-app" target="__blank">
          <div className="title">
            <SvgIcon iconName="github" width="24px" height="24px" />
            <span>Quick start of your web3 app</span>
            <div style={{ flexGrow: 1 }} />
            <SvgIcon iconName="arrow-up-right" />
          </div>
        </a>
      </div>
      <div className="background-radial-gradient"></div>
    </>
  )
}

export default App
