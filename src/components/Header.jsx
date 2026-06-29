import { Shield, RefreshCw, LogOut } from 'lucide-react'

export default function Header({ syncTime, onRefresh, onLogout, loading, newCount = 0 }) {
  const now = new Date()
  const dayStr = now.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })

  return (
    <header style={styles.header}>
      <div style={styles.inner}>
        {/* Brand */}
        <div style={styles.brand}>
          <div style={styles.shieldWrap}>
            <Shield size={16} color="var(--accent)" />
          </div>
          <span style={styles.brandText}>
            Shadow<span style={{ color: 'var(--accent)' }}>Guard</span>
          </span>
          <span style={styles.consoleBadge}>ADMIN</span>
        </div>

        {/* Right controls */}
        <div style={styles.controls}>
          <div style={styles.liveRow}>
            <span style={styles.liveDot} />
            <span style={styles.liveLabel}>LIVE</span>
          </div>

          {newCount > 0 && (
            <div style={styles.newBadge}>+{newCount} new</div>
          )}

          <div style={styles.timeBlock}>
            <span style={styles.syncText}>
              {syncTime !== '–' ? `Synced ${syncTime}` : 'Awaiting sync…'}
            </span>
            <span style={styles.dayText}>{dayStr}</span>
          </div>

          <button style={styles.btn} onClick={onRefresh} title="Refresh now">
            <RefreshCw size={12} style={{ animation: loading ? 'spin 0.7s linear infinite' : 'none' }} />
            <span>Refresh</span>
          </button>
          <button
            style={styles.btn}
            onClick={onLogout}
            title="Sign out"
            onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--blocked)'; e.currentTarget.style.color = 'var(--blocked)' }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border2)'; e.currentTarget.style.color = 'var(--text)' }}
          >
            <LogOut size={12} />
            <span>Logout</span>
          </button>
        </div>
      </div>

      <style>{`
        @media (min-width: 769px) {
          .sg-sync { display: flex !important; }
        }
      `}</style>
    </header>
  )
}

const styles = {
  header: {
    borderBottom: '1px solid var(--border)',
    background: 'rgba(8,11,15,0.95)',
    backdropFilter: 'blur(12px)',
    position: 'sticky',
    top: 0,
    zIndex: 100,
  },
  inner: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '12px 24px',
    maxWidth: '1200px',
    margin: '0 auto',
    flexWrap: 'wrap',
    gap: '8px',
  },
  brand: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  },
  shieldWrap: {
    width: '32px',
    height: '32px',
    background: 'var(--bg3)',
    border: '1px solid var(--border2)',
    borderRadius: '7px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  brandText: {
    fontSize: '18px',
    fontWeight: '800',
    fontFamily: 'var(--sans)',
  },
  consoleBadge: {
    background: 'var(--bg3)',
    border: '1px solid var(--border2)',
    borderRadius: '4px',
    padding: '2px 7px',
    fontFamily: 'var(--mono)',
    fontSize: '9px',
    color: 'var(--muted)',
    letterSpacing: '0.1em',
  },
  controls: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    flexWrap: 'wrap',
  },
  liveRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '5px',
  },
  liveDot: {
    width: '7px',
    height: '7px',
    borderRadius: '50%',
    background: 'var(--safe)',
    animation: 'pulse 2s ease-in-out infinite',
    display: 'inline-block',
  },
  liveLabel: {
    fontFamily: 'var(--mono)',
    fontSize: '10px',
    color: 'var(--safe)',
    letterSpacing: '0.1em',
  },
  newBadge: {
    background: 'var(--safe-bg)',
    border: '1px solid var(--safe-border)',
    color: 'var(--safe)',
    fontFamily: 'var(--mono)',
    fontSize: '10px',
    fontWeight: '700',
    padding: '2px 8px',
    borderRadius: '4px',
    letterSpacing: '0.05em',
    animation: 'fadeIn 0.3s ease',
  },
  timeBlock: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-end',
  },
  syncText: {
    fontFamily: 'var(--mono)',
    fontSize: '11px',
    color: 'var(--muted)',
    lineHeight: 1.2,
  },
  dayText: {
    fontFamily: 'var(--mono)',
    fontSize: '9px',
    color: 'var(--border2)',
    letterSpacing: '0.06em',
    lineHeight: 1.2,
  },
  btn: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    background: 'var(--bg3)',
    border: '1px solid var(--border2)',
    color: 'var(--text)',
    padding: '7px 12px',
    borderRadius: '6px',
    fontFamily: 'var(--mono)',
    fontSize: '11px',
    cursor: 'pointer',
    transition: 'border-color 0.15s, color 0.15s',
  },
}