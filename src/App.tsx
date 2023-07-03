import './App.css'
import { SvgIcon } from './components/SvgIcon'

function App() {
  return (
    <>
      <div className="container">
        <div className="title">
          <SvgIcon iconName="github" width="24px" height="24px" />
          <span>Quick start of your web3 app</span>
          <div style={{ flexGrow: 1 }} />
          <SvgIcon iconName="arrow-up-right" />
        </div>
      </div>
      <div className="background-radial-gradient"></div>
    </>
  )
}

export default App
