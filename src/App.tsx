import './App.css'
import { getTokens } from '@/api/approve'
import { SvgIcon } from '@/components/SvgIcon'
import { Radio, RadioChangeEvent, message } from 'antd'
import { useEffect, useState } from 'react'

const options = [
  { label: 'DEV', value: 'dev' },
  { label: 'TEST', value: 'test' },
  { label: 'PROD', value: 'prod' },
]

function App() {
  const [env, setEnv] = useState('dev')

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

  return (
    <>
      <div className="container">
        Environment:
        <Radio.Group
          options={options}
          onChange={onChangeEnv}
          value={env}
          optionType="button"
          buttonStyle="solid"
        />
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
