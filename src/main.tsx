import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import { Web3ReactProvider } from '@web3-react/core'
import { connectors } from './connectors'
import { BrowserRouter } from 'react-router-dom'
//SVG插件配置
import 'virtual:svg-icons-register'
import './index.css'

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <BrowserRouter>
      <Web3ReactProvider connectors={connectors}>
        <App />
      </Web3ReactProvider>
    </BrowserRouter>
  </React.StrictMode>,
)
