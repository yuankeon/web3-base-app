import './App.css'
import { getTokens } from '@/api/approve'
import { SvgIcon } from '@/components/SvgIcon'
import { message, Input, Divider, Button } from 'antd'
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
            {TITLE.map((item, index) => (
              <div
                key={item.title}
                style={{
                  width: item.width,
                  textAlign: index === 3 ? 'center' : 'left',
                }}
              >
                {item.title}
              </div>
            ))}
          </div>

          <div className="pair-content">
            {!pairList
              ? 'loading...'
              : pairList.map((item) => (
                  <div key={item.tokenAddress} className="pair-list">
                    <div
                      style={{
                        width: TITLE[0].width,
                        display: 'flex',
                        alignItems: 'center',
                      }}
                    >
                      <SvgIcon
                        iconName={TokenMaps[item.tokenName]}
                        width="20px"
                        height="20px"
                      />
                      <span>{item.symbol}</span>
                    </div>
                    <div style={{ width: TITLE[1].width }}>0</div>
                    <div style={{ width: TITLE[2].width }}>
                      <Input style={{ width: '80%' }} />
                    </div>
                    <div style={{ width: TITLE[3].width, textAlign: 'center' }}>
                      <Button type="link">Approve</Button>
                    </div>
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
