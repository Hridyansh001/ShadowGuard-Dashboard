import { useState } from 'react'

const VARIANT_MAP = {
  total:   { color: 'var(--text)',    bg: 'var(--bg3)',        border: 'var(--border2)', glow: 'rgba(226,232,240,0.08)' },
  blocked: { color: 'var(--blocked)', bg: 'var(--blocked-bg)', border: 'var(--blocked-border)', glow: 'rgba(239,68,68,0.12)' },
  warning: { color: 'var(--warning)', bg: 'var(--warning-bg)', border: 'var(--warning-border)', glow: 'rgba(245,158,11,0.12)' },
  safe:    { color: 'var(--safe)',    bg: 'var(--safe-bg)',    border: 'var(--safe-border)', glow: 'rgba(34,197,94,0.12)' },
}

export default function StatsCard({ title, value, variant = 'total', icon: Icon }) {
  const [hovered, setHovered] = useState(false)
  const v = VARIANT_MAP[variant] || VARIANT_MAP.total

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: hovered ? v.bg : 'var(--bg2)',
        border: '1px solid',
        borderColor: hovered ? v.border : 'var(--border)',
        borderBottom: `3px solid ${v.color}`,
        borderRadius: '10px',
        padding: '18px 20px',
        transition: 'all 0.2s ease',
        boxShadow: hovered ? `0 0 24px ${v.glow}` : 'none',
        cursor: 'default',
        animation: 'fadeIn 0.3s ease',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Subtle bg glow on hover */}
      {hovered && (
        <div style={{
          position: 'absolute', inset: 0,
          background: `radial-gradient(ellipse at top right, ${v.glow}, transparent 70%)`,
          pointerEvents: 'none',
        }} />
      )}

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px', position: 'relative' }}>
        <span style={{ fontFamily: 'var(--mono)', fontSize: '10px', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
          {title}
        </span>
        {Icon && (
          <div style={{
            width: '28px', height: '28px',
            background: v.bg,
            border: `1px solid ${v.border}`,
            borderRadius: '7px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <Icon size={13} color={v.color} />
          </div>
        )}
      </div>

      <div style={{
        fontSize: 'clamp(24px, 3vw, 36px)',
        fontWeight: '800',
        color: v.color,
        lineHeight: 1,
        position: 'relative',
      }}>
        {value.toLocaleString()}
      </div>
    </div>
  )
}