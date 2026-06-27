import { useState, useCallback, useEffect } from 'react'
import { Scan, Ban, AlertTriangle, CheckCircle } from 'lucide-react'
import LoginPage from './components/LoginPage'
import Header from './components/Header'
import StatsCard from './components/StatsCard'
import ThreatChart from './components/ThreatChart'
import AlertFeed from './components/AlertFeed'
import { useAlerts } from './hooks/useAlerts'

function useIsMobile() {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768)
  useEffect(() => {
    const handler = () => setIsMobile(window.innerWidth <= 768)
    window.addEventListener('resize', handler)
    return () => window.removeEventListener('resize', handler)
  }, [])
  return isMobile
}

export default function App() {
  const isMobile = useIsMobile()

  const [token, setToken] = useState(() => {
    const saved = sessionStorage.getItem('sg_token')
    const expiry = sessionStorage.getItem('sg_expiry')
    if (saved && expiry && Date.now() < Number(expiry)) return saved
    sessionStorage.clear()
    return null
  })

  function handleLogin(newToken) {
    const TIMEOUT_MS = 30 * 60 * 1000
    sessionStorage.setItem('sg_token', newToken)
    sessionStorage.setItem('sg_expiry', Date.now() + TIMEOUT_MS)
    setToken(newToken)
  }

  const logout = useCallback(() => {
    sessionStorage.removeItem('sg_token')
    sessionStorage.removeItem('sg_expiry')
    setToken(null)
  }, [])

  const { alerts, loading, syncTime, error, fetchData, stats, newCount } = useAlerts(token, logout)

  if (!token) return <LoginPage onLogin={handleLogin} />

  return (
    <div style={styles.root}>
      <Header
        syncTime={syncTime}
        onRefresh={fetchData}
        onLogout={logout}
        loading={loading}
        newCount={newCount}
      />

      <div style={styles.wrap}>
        {error && (
          <div style={styles.errorBanner}>
            <AlertTriangle size={13} />
            <span>{error}</span>
          </div>
        )}

        <div style={{
          display: 'grid',
          gridTemplateColumns: isMobile ? 'repeat(2, 1fr)' : 'repeat(4, 1fr)',
          gap: isMobile ? '10px' : '14px',
          marginBottom: '20px',
        }}>
          <StatsCard title="Total Scans" value={stats.total}   variant="total"   icon={Scan} />
          <StatsCard title="Blocked"     value={stats.blocked} variant="blocked" icon={Ban} />
          <StatsCard title="Warnings"    value={stats.warning} variant="warning" icon={AlertTriangle} />
          <StatsCard title="Safe"        value={stats.safe}    variant="safe"    icon={CheckCircle} />
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: isMobile ? '1fr' : '300px 1fr',
          gap: '16px',
          alignItems: 'start',
        }}>
          <div style={{ position: isMobile ? 'static' : 'sticky', top: '80px' }}>
            <ThreatChart alerts={alerts} />
          </div>
          <div>
            <AlertFeed alerts={alerts} />
          </div>
        </div>
      </div>
    </div>
  )
}

const styles = {
  root: {
    minHeight: '100vh',
    position: 'relative',
    zIndex: 1,
  },
  wrap: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '16px 16px 48px',
  },
  errorBanner: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    background: 'var(--blocked-bg)',
    border: '1px solid var(--blocked-border)',
    borderRadius: '8px',
    padding: '12px 16px',
    fontFamily: 'var(--mono)',
    fontSize: '12px',
    color: 'var(--blocked)',
    marginBottom: '16px',
  },
}

// import { useState, useCallback } from 'react'
// import { Shield, Scan, Ban, AlertTriangle, CheckCircle } from 'lucide-react'
// import LoginPage from './components/LoginPage'
// import Header from './components/Header'
// import StatsCard from './components/StatsCard'
// import ThreatChart from './components/ThreatChart'
// import AlertFeed from './components/AlertFeed'
// import { useAlerts } from './hooks/useAlerts'

// // const TIMEOUT_MS = 30 * 60 * 1000
// export default function App() {
//   const [token, setToken] = useState(() => {
//   const saved = sessionStorage.getItem('sg_token') 
//   const expiry = sessionStorage.getItem('sg_expiry')
//   if (saved && expiry && Date.now() < Number(expiry)) return saved
//   sessionStorage.clear()
//   return null
// })

// function handleLogin(newToken) {
//     const TIMEOUT_MS = 30 * 60 * 1000 // change this
//     sessionStorage.setItem('sg_token', newToken)
//     sessionStorage.setItem('sg_expiry', Date.now() + TIMEOUT_MS)
//     setToken(newToken)
//   }

//   const logout = useCallback(() => {
//   sessionStorage.removeItem('sg_token')
//   sessionStorage.removeItem('sg_expiry')
//   setToken(null)
// }, [])

//   const { alerts, loading, syncTime, error, fetchData, stats, newCount } = useAlerts(token, logout)

//   if (!token) {
    
//     return <LoginPage onLogin={handleLogin} />
//   }

//   return (
//     <div style={styles.root}>
//       <Header
//   syncTime={syncTime}
//   onRefresh={fetchData}
//   onLogout={logout}
//   loading={loading}
//   newCount={newCount}
// />
// <style>{`
//   @media (max-width: 768px) {
//     .sg-stats { grid-template-columns: repeat(2, 1fr) !important; }
//     .sg-main  { grid-template-columns: 1fr !important; }
//   }
// `}</style>
      

//       <div style={styles.wrap}>
//         {/* Error banner */}
//         {error && (
//           <div style={styles.errorBanner}>
//             <AlertTriangle size={13} />
//             <span>{error}</span>
//           </div>
//         )}

//         {/* Stats row */}
//         <div className="sg-stats" style={styles.statsGrid}>
//           <StatsCard title="Total Scans"  value={stats.total}   variant="total"   icon={Scan} />
//           <StatsCard title="Blocked"      value={stats.blocked} variant="blocked" icon={Ban} />
//           <StatsCard title="Warnings"     value={stats.warning} variant="warning" icon={AlertTriangle} />
//           <StatsCard title="Safe"         value={stats.safe}    variant="safe"    icon={CheckCircle} />
//         </div>

//         {/* Main layout: chart + feed */}
//         <div className="sg-main" style={styles.mainGrid}>
//           {/* Left: threat chart — sticky */}
//           <div style={styles.chartCol}>
//             <ThreatChart alerts={alerts} />
//           </div>

//           {/* Right: alert feed */}
//           <div style={styles.feedCol}>
//             <AlertFeed alerts={alerts} />
//           </div>
//         </div>
//       </div>
//     </div>
//   )
// }

// const styles = {
//   root: {
//     minHeight: '100vh',
//     position: 'relative',
//     zIndex: 1,
//   },
//   wrap: {
//     maxWidth: '1200px',
//     margin: '0 auto',
//     // padding: '24px 24px 48px',
//     padding: '16px 16px 48px',
//   },
//   errorBanner: {
//     display: 'flex',
//     alignItems: 'center',
//     gap: '8px',
//     background: 'var(--blocked-bg)',
//     border: '1px solid var(--blocked-border)',
//     borderRadius: '8px',
//     padding: '12px 16px',
//     fontFamily: 'var(--mono)',
//     fontSize: '12px',
//     color: 'var(--blocked)',
//     marginBottom: '20px',
//   },
//   statsGrid: {
//     display: 'grid',
//     gridTemplateColumns: 'repeat(4, 1fr)',
//     gap: '14px',
//     marginBottom: '24px',
//   },
//   mainGrid: {
//     display: 'grid',
//     gridTemplateColumns: '320px 1fr',
//     gap: '20px',
//     alignItems: 'start',
//   },
//   chartCol: {
//     position: 'sticky',
//     top: '80px',
//   },
//   feedCol: {},
// }