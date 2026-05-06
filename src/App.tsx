import { useState } from 'react'
import { Navbar } from './components/Navbar'
import { Dashboard } from './components/tabs/Dashboard'
import { Features } from './components/tabs/Features'
import { Models } from './components/tabs/Models'
import { Predict } from './components/tabs/Predict'
import { Logs } from './components/tabs/Logs'
import { Analytics } from './components/tabs/Analytics'
import './styles/globals.css'

function App() {
  const [activeTab, setActiveTab] = useState('dashboard')

  const renderTab = () => {
    switch (activeTab) {
      case 'dashboard': return <Dashboard />
      case 'features':  return <Features />
      case 'models':    return <Models />
      case 'predict':   return <Predict />
      case 'logs':      return <Logs />
      case 'analytics': return <Analytics />
      default:          return <Dashboard />
    }
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', position: 'relative' }}>
      <Navbar activeTab={activeTab} onTabChange={setActiveTab} />
      <main style={{ maxWidth: 1280, margin: '0 auto', padding: '80px 24px 60px', position: 'relative', zIndex: 2 }}>
        {renderTab()}
      </main>
      <footer style={{
        borderTop: '1px solid var(--border)', padding: '16px 24px', marginTop: 40,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        position: 'relative', zIndex: 2,
      }}>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--text-3)', letterSpacing: '0.06em' }}>
          MLOPS_LITE · PLATFORM v2.0 · React + TypeScript + Vite · 5 Microservices
        </div>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--text-3)' }}>
          Ms1·FastAPI · Ms2·SpringBoot · Ms3·Express · Ms4·Gateway · Ms5·Athena
        </div>
      </footer>
    </div>
  )
}

export default App
