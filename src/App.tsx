import './App.css'
import { Header } from '@/layout/Header'
import { ContentList } from '@/layout/Content'
import { Footer } from '@/layout/Footer'
import { ConfigProvider, theme } from 'antd'
import { useUserStore } from './store'
import { useEagerlyConnect } from '@/hooks/useConnectWallet'

function App() {
  const darkMode = useUserStore((state) => state.darkMode)

  //尝试主动连接钱包
  useEagerlyConnect()

  return (
    <ConfigProvider
      theme={{
        algorithm: darkMode ? theme.darkAlgorithm : theme.defaultAlgorithm,
        token: {
          colorPrimary: '#8247e5',
        },
      }}
    >
      <Header />
      <div className="container">
        <ContentList />
        <Footer />
      </div>
      <div className="background-radial-gradient"></div>
    </ConfigProvider>
  )
}

export default App
