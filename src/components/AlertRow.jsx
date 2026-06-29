import { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import {
  AlertTriangle, Ban, CheckCircle,
  X, Clock, Hash, Tag, FileText, ShieldAlert,
} from 'lucide-react'

const VERDICT_CONFIG = {
  BLOCKED: { color: 'var(--blocked)', bg: 'var(--blocked-bg)', border: 'var(--blocked-border)', accent: '#ef4444', Icon: Ban, glow: 'rgba(239,68,68,0.15)' },
  WARNING:  { color: 'var(--warning)', bg: 'var(--warning-bg)', border: 'var(--warning-border)', accent: '#f59e0b', Icon: AlertTriangle, glow: 'rgba(245,158,11,0.15)' },
  SAFE:     { color: 'var(--safe)',    bg: 'var(--safe-bg)',    border: 'var(--safe-border)',    accent: '#22c55e', Icon: CheckCircle, glow: 'rgba(34,197,94,0.15)' },
}

function useIsMobile() {
  const [isMobile, setIsMobile] = useState(() => window.innerWidth < 900)
  useEffect(() => {
    const handler = () => setIsMobile(window.innerWidth < 900)
    window.addEventListener('resize', handler)
    return () => window.removeEventListener('resize', handler)
  }, [])
  return isMobile
}

function RiskPill({ score }) {
  const color = score >= 75 ? 'var(--blocked)' : score >= 40 ? 'var(--warning)' : 'var(--safe)'
  const bg = score >= 75 ? 'var(--blocked-bg)' : score >= 40 ? 'var(--warning-bg)' : 'var(--safe-bg)'
  const border = score >= 75 ? 'var(--blocked-border)' : score >= 40 ? 'var(--warning-border)' : 'var(--safe-border)'
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: '5px',
      background: bg, border: `1px solid ${border}`,
      borderRadius: '5px', padding: '2px 7px',
      fontFamily: 'var(--mono)', fontSize: '10px',
      color, fontWeight: '700',
    }}>
      {score}
    </div>
  )
}

function AlertModal({ alert, onClose }) {
  const isMobile = useIsMobile()
  const cfg = VERDICT_CONFIG[alert.verdict] || VERDICT_CONFIG.SAFE
  const { Icon } = cfg
  const score = alert.riskScore || 0
  const scoreColor = score >= 75 ? 'var(--blocked)' : score >= 40 ? 'var(--warning)' : 'var(--safe)'

  const time = new Date(alert.timestamp)
  const timeStr = isNaN(time.getTime()) ? '–' : time.toLocaleString(undefined, {
    month: 'short', day: 'numeric', year: 'numeric',
    hour: '2-digit', minute: '2-digit', second: '2-digit',
  })

  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [onClose])

  return createPortal(
    <div
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0, zIndex: 1000,
        background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(6px)',
        display: 'flex',
        alignItems: isMobile ? 'flex-start' : 'center',
        justifyContent: 'center',
        padding: isMobile ? '8px' : '24px',
        paddingTop: isMobile ? '50px' : '24px',
        overflowY: 'auto',
        animation: 'fadeIn 0.15s ease',
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: 'var(--bg2)',
          border: '1px solid var(--border2)',
          borderTop: `3px solid ${cfg.accent}`,
          borderRadius: '14px',
          width: '100%',
          maxWidth: '600px',
          maxHeight: isMobile ? 'calc(100vh - 70px)' : '90vh',
          display: 'flex', flexDirection: 'column',
          boxShadow: `0 0 60px ${cfg.glow}, 0 32px 80px rgba(0,0,0,0.7)`,
          animation: 'fadeIn 0.18s ease',
        }}
      >
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 20px', borderBottom: '1px solid var(--border)', flexShrink: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', border: '1px solid', borderRadius: '4px', padding: '3px 8px', fontFamily: 'var(--mono)', fontSize: '9px', fontWeight: '700', letterSpacing: '0.08em', color: cfg.color, borderColor: cfg.border, background: cfg.bg }}>
              <Icon size={11} /><span>{alert.verdict}</span>
            </div>
            <span style={{ fontFamily: 'var(--sans)', fontSize: '15px', fontWeight: '700', color: 'var(--text)' }}>Alert Detail</span>
          </div>
          <button onClick={onClose} style={{ background: 'var(--bg3)', border: '1px solid var(--border2)', borderRadius: '6px', color: 'var(--muted)', cursor: 'pointer', padding: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <X size={15} />
          </button>
        </div>

        {/* Scrollable body */}
        <div style={{ overflowY: 'auto', flex: 1, padding: '18px 20px', display: 'flex', flexDirection: 'column', gap: '18px' }}>

          {/* Risk score */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontFamily: 'var(--mono)', fontSize: '10px', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '10px' }}>
              <ShieldAlert size={11} /><span>Risk Score</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '8px' }}>
              <span style={{ fontFamily: 'var(--mono)', fontSize: '11px', color: 'var(--muted)' }}>0</span>
              <span style={{ fontFamily: 'var(--mono)', fontSize: '32px', fontWeight: '800', color: scoreColor }}>
                {score}<span style={{ fontSize: '13px', color: 'var(--muted)', fontWeight: '400' }}>/100</span>
              </span>
              <span style={{ fontFamily: 'var(--mono)', fontSize: '11px', color: 'var(--muted)' }}>100</span>
            </div>
            <div style={{ height: '6px', background: 'var(--border)', borderRadius: '3px', overflow: 'hidden' }}>
              <div style={{ height: '100%', width: `${score}%`, background: scoreColor, borderRadius: '3px', boxShadow: `0 0 8px ${scoreColor}88` }} />
            </div>
          </div>

          {/* Scanned text */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontFamily: 'var(--mono)', fontSize: '10px', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '8px' }}>
              <FileText size={11} /><span>Scanned Text</span>
            </div>
            <div style={{ background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: '8px', padding: '12px 14px', fontFamily: 'var(--mono)', fontSize: '12px', color: 'var(--text)', lineHeight: '1.75', whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
              {alert.mask || alert.text || '—'}
            </div>
          </div>

          {/* Original text if masked */}
          {alert.text && alert.mask && alert.text !== alert.mask && (
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontFamily: 'var(--mono)', fontSize: '10px', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '8px' }}>
                <FileText size={11} /><span>Original Text</span>
              </div>
              <div style={{ background: cfg.bg, border: `1px solid ${cfg.border}`, borderRadius: '8px', padding: '12px 14px', fontFamily: 'var(--mono)', fontSize: '12px', color: 'var(--text)', lineHeight: '1.75', whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
                {alert.text}
              </div>
            </div>
          )}

          {/* Trigger categories */}
          {(alert.topReasons || []).length > 0 && (
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontFamily: 'var(--mono)', fontSize: '10px', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '8px' }}>
                <Tag size={11} /><span>Trigger Categories</span>
              </div>
              <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                {alert.topReasons.map((r, i) => (
                  <span key={i} style={{ border: '1px solid', borderRadius: '4px', padding: '4px 10px', fontFamily: 'var(--mono)', fontSize: '10px', fontWeight: '600', color: cfg.color, borderColor: cfg.border, background: cfg.bg }}>
                    {r}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Metadata */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '10px' }}>
            {alert.id && (
              <div style={{ background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: '8px', padding: '12px 14px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '5px', fontFamily: 'var(--mono)', fontSize: '9px', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '6px' }}>
                  <Hash size={10} /><span>Event ID</span>
                </div>
                <div style={{ fontFamily: 'var(--mono)', fontSize: '11px', color: 'var(--text)', wordBreak: 'break-all', lineHeight: '1.5' }}>{alert.id}</div>
              </div>
            )}
            <div style={{ background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: '8px', padding: '12px 14px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '5px', fontFamily: 'var(--mono)', fontSize: '9px', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '6px' }}>
                <Clock size={10} /><span>Timestamp</span>
              </div>
              <div style={{ fontFamily: 'var(--mono)', fontSize: '11px', color: 'var(--text)', wordBreak: 'break-all', lineHeight: '1.5' }}>{timeStr}</div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 20px', borderTop: '1px solid var(--border)', flexShrink: 0 }}>
          <span style={{ fontFamily: 'var(--mono)', fontSize: '10px', color: 'var(--muted)' }}>
            {isMobile ? 'Tap outside to close' : 'Press Esc or click outside to close'}
          </span>
          <button onClick={onClose} style={{ background: 'var(--bg3)', border: '1px solid var(--border2)', borderRadius: '6px', color: 'var(--text)', cursor: 'pointer', padding: '7px 18px', fontFamily: 'var(--mono)', fontSize: '11px' }}>
            Close
          </button>
        </div>
      </div>
    </div>,
    document.body
  )
}

export default function AlertRow({ alert, isNew = false }) {
  const [open, setOpen] = useState(false)
  const [hovered, setHovered] = useState(false)
  const cfg = VERDICT_CONFIG[alert.verdict] || VERDICT_CONFIG.SAFE
  const { Icon } = cfg

  const time = new Date(alert.timestamp)
  const timeStr = isNaN(time.getTime()) ? '–' : time.toLocaleTimeString()
  const dateStr = isNaN(time.getTime()) ? '' : time.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })

  return (
    <>
      <div
        onClick={() => setOpen(true)}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          background: hovered ? cfg.bg : 'var(--bg2)',
          border: '1px solid',
          borderColor: hovered ? cfg.border : 'var(--border)',
          borderLeft: `3px solid ${cfg.accent}`,
          borderRadius: '10px',
          overflow: 'hidden',
          cursor: 'pointer',
          animation: 'fadeIn 0.2s ease',
          transition: 'all 0.15s ease',
          boxShadow: hovered ? `0 0 20px ${cfg.glow}, inset 0 0 20px ${cfg.glow}` : 'none',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '13px 16px', gap: '10px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', minWidth: 0, flex: 1 }}>
            {isNew && (
              <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--safe)', flexShrink: 0, boxShadow: '0 0 6px var(--safe)', animation: 'pulse 2s ease-in-out infinite' }} />
            )}
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', border: '1px solid', borderRadius: '4px', padding: '3px 8px', fontFamily: 'var(--mono)', fontSize: '9px', fontWeight: '700', letterSpacing: '0.08em', flexShrink: 0, color: cfg.color, borderColor: cfg.border, background: cfg.bg }}>
              <Icon size={10} /><span>{alert.verdict}</span>
            </div>
            <div style={{ fontFamily: 'var(--mono)', fontSize: '12px', color: 'var(--text)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {alert.mask || alert.text || '—'}
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexShrink: 0 }}>
            <RiskPill score={alert.riskScore || 0} />
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
              <span style={{ fontFamily: 'var(--mono)', fontSize: '11px', color: 'var(--text)' }}>{timeStr}</span>
              <span style={{ fontFamily: 'var(--mono)', fontSize: '9px', color: 'var(--muted)' }}>{dateStr}</span>
            </div>
            <div style={{
              fontFamily: 'var(--mono)', fontSize: '9px',
              color: hovered ? cfg.color : 'var(--muted)',
              background: hovered ? cfg.bg : 'var(--bg3)',
              border: `1px solid ${hovered ? cfg.border : 'var(--border)'}`,
              borderRadius: '4px', padding: '2px 7px', letterSpacing: '0.08em',
              transition: 'all 0.15s',
              boxShadow: hovered ? `0 0 8px ${cfg.glow}` : 'none',
            }}>
              VIEW
            </div>
          </div>
        </div>
      </div>

      {open && <AlertModal alert={alert} onClose={() => setOpen(false)} />}
    </>
  )
}