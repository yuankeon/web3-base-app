import './App.css'
import { getTokens } from '@/api/approve'
import { SvgIcon } from '@/components/SvgIcon'
import { message, Input, Divider } from 'antd'
import { useEffect, useState } from 'react'
import { reduceData } from '@/utils'
import { PairItem } from '@/types/app'
import { TokenMaps, TITLE } from '@/config'
import { Footer } from '@/layout/Footer'
import { Header } from '@/layout/Header'

function App() {
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

  return (
    <>
      <Header />
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
        <Footer />
      </div>
      <div className="background-radial-gradient"></div>
    </>
  )
}

export default App
