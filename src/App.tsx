import './App.css'
import { getTokens } from '@/api/approve'
import { SvgIcon } from '@/components/SvgIcon'
import { Button, Radio, RadioChangeEvent, message } from 'antd'
import { useEffect, useState } from 'react'
import { useWeb3React } from '@web3-react/core'
import { metaMask } from '@/connectors/metaMask'

const options = [
  { label: 'DEV', value: 'dev' },
  { label: 'TEST', value: 'test' },
  { label: 'PROD', value: 'prod' },
]

function App() {
  const [env, setEnv] = useState('dev')
  const { isActivating, isActive, account, chainId, provider } = useWeb3React()

  console.log({
    chainId,
    account,
    isActivating,
    isActive,
    provider,
  })

  // attempt to connect eagerly on mount 刷新页面保持连接
  useEffect(() => {
    void metaMask.connectEagerly().catch(() => {
      console.debug('Failed to connect eagerly to metamask')
    })
  }, [])

  const onChangeEnv = (event: RadioChangeEvent) => {
    setEnv(event.target.value)
  }

  useEffect(() => {
    function getPairList() {
      getTokens(env)
        .then((res) => {
          console.log(res)
        })
        .catch((error: Error) => {
          message.error({
            content: error.message,
          })
        })
    }
    getPairList()
  }, [env])

  const connectWallet = () => {
    metaMask.activate()
  }

  return (
    <>
      <div className="container">
        <div className="card">
          当前环境:
          <Radio.Group
            options={options}
            onChange={onChangeEnv}
            value={env}
            optionType="button"
            buttonStyle="solid"
          />
          授权合约:
          <Button type="primary" onClick={connectWallet}>
            Connect Wallet
          </Button>
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
