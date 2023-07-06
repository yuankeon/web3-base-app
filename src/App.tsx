import './App.css'
import { Header } from '@/layout/Header'
import { ContentList } from '@/layout/Content'
import { Footer } from '@/layout/Footer'

function App() {
  return (
    <>
      <Header />
      <div className="container">
        <ContentList />
        <Footer />
      </div>
      <div className="background-radial-gradient"></div>
    </>
  )
}

export default App
