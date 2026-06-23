import { useState, useEffect } from 'react'
import { Shield, Eye, EyeOff, AlertCircle, Lock } from 'lucide-react'
import { loginRequest } from '../hooks/useAlerts'

const LOADING_STEPS = [
  'Verifying credentials…',
  'Checking permissions…',
  'Establishing secure session…',
  'Loading console…',
]

export default function LoginPage({ onLogin }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPass, setShowPass] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [loadingStep, setLoadingStep] = useState(0)
  const [progress, setProgress] = useState(0)

  // Animate loading steps while authenticating
  useEffect(() => {
    if (!loading) { setLoadingStep(0); setProgress(0); return }
    let step = 0
    const stepInterval = setInterval(() => {
      step = Math.min(step + 1, LOADING_STEPS.length - 1)
      setLoadingStep(step)
    }, 600)
    // Progress bar animation
    let p = 0
    const progInterval = setInterval(() => {
      p = Math.min(p + 2, 90) // goes to 90, jumps to 100 on success
      setProgress(p)
    }, 50)
    return () => { clearInterval(stepInterval); clearInterval(progInterval) }
  }, [loading])

  async function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const data = await loginRequest(email, password)
      setProgress(100)
      setTimeout(() => onLogin(data.token), 300)
    } catch (err) {
      setError(err.message)
      setLoading(false)
    }
  }

  return (
    <div style={styles.overlay}>
      <div style={styles.scanline} />

      <div style={styles.card}>
        {/* Logo */}
        <div style={styles.logoRow}>
          <div style={styles.logoIcon}>
            <Shield size={20} color="var(--accent)" />
          </div>
          <span style={styles.logoText}>
            Shadow<span style={{ color: 'var(--accent)' }}>Guard</span>
          </span>
        </div>
        <p style={styles.subtitle}>ADMIN CONSOLE — RESTRICTED ACCESS</p>

        {/* Loading overlay inside card */}
        {loading && (
          <div style={styles.loadingOverlay}>
            {/* Progress bar at top of card */}
            <div style={styles.progressTrack}>
              <div style={{ ...styles.progressBar, width: `${progress}%` }} />
            </div>

            <div style={styles.loadingContent}>
              {/* Animated shield */}
              <div style={styles.shieldAnim}>
                <Shield size={36} color="var(--accent)" />
                <div style={styles.shieldRing} />
                <div style={{ ...styles.shieldRing, animationDelay: '0.4s', opacity: 0.5 }} />
              </div>

              {/* Step text */}
              <div style={styles.loadingStep}>{LOADING_STEPS[loadingStep]}</div>

              {/* Dots */}
              <div style={styles.dotsRow}>
                {[0, 1, 2].map((i) => (
                  <div
                    key={i}
                    style={{
                      ...styles.dot,
                      animationDelay: `${i * 0.2}s`,
                    }}
                  />
                ))}
              </div>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ ...styles.form, opacity: loading ? 0 : 1, pointerEvents: loading ? 'none' : 'auto', transition: 'opacity 0.2s' }}>
          <label style={styles.label}>Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="admin@shadowguard.io"
            style={styles.input}
            required
            autoComplete="email"
            disabled={loading}
          />

          <label style={styles.label}>Password</label>
          <div style={{ position: 'relative' }}>
            <input
              type={showPass ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••••••"
              style={{ ...styles.input, paddingRight: '44px' }}
              required
              autoComplete="current-password"
              disabled={loading}
            />
            <button type="button" onClick={() => setShowPass((v) => !v)} style={styles.eyeBtn}>
              {showPass ? <EyeOff size={14} /> : <Eye size={14} />}
            </button>
          </div>

          {error && (
            <div style={styles.errorBox}>
              <AlertCircle size={13} />
              <span>{error}</span>
            </div>
          )}

          <button type="submit" style={styles.submitBtn} disabled={loading}>
            <Lock size={13} />
            <span>AUTHENTICATE</span>
          </button>
        </form>

        <p style={styles.footer}>
          Unauthorised access is prohibited and may be prosecuted.
        </p>
      </div>

      <style>{`
        @keyframes dotBounce {
          0%, 80%, 100% { transform: translateY(0); opacity: 0.4; }
          40% { transform: translateY(-6px); opacity: 1; }
        }
        @keyframes ringPulse {
          0% { transform: scale(1); opacity: 0.6; }
          100% { transform: scale(2.2); opacity: 0; }
        }
      `}</style>
    </div>
  )
}

const styles = {
  overlay: {
    position: 'fixed',
    inset: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'radial-gradient(ellipse at center, #0e141b 0%, var(--bg) 70%)',
  },
  scanline: {
    position: 'fixed',
    inset: 0,
    background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.015) 2px, rgba(255,255,255,0.015) 4px)',
    pointerEvents: 'none',
  },
  card: {
    background: 'var(--bg2)',
    border: '1px solid var(--border2)',
    borderRadius: '16px',
    padding: '40px',
    width: '100%',
    maxWidth: '400px',
    position: 'relative',
    zIndex: 1,
    boxShadow: '0 0 60px rgba(249,115,22,0.06), 0 24px 48px rgba(0,0,0,0.5)',
    overflow: 'hidden',
  },
  logoRow: { display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' },
  logoIcon: { width: '36px', height: '36px', background: 'var(--bg3)', border: '1px solid var(--border2)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' },
  logoText: { fontSize: '22px', fontWeight: '800', fontFamily: 'var(--sans)' },
  subtitle: { fontFamily: 'var(--mono)', fontSize: '9px', color: 'var(--muted)', letterSpacing: '0.12em', marginBottom: '32px' },
  form: { display: 'flex', flexDirection: 'column', gap: '6px' },
  label: { fontFamily: 'var(--mono)', fontSize: '10px', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginTop: '12px', marginBottom: '4px' },
  input: { width: '100%', background: 'var(--bg3)', border: '1px solid var(--border2)', borderRadius: '8px', padding: '12px 14px', color: 'var(--text)', fontFamily: 'var(--mono)', fontSize: '13px', outline: 'none', transition: 'border-color 0.15s' },
  eyeBtn: { position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'var(--muted)', cursor: 'pointer', padding: '4px', display: 'flex', alignItems: 'center' },
  errorBox: { display: 'flex', alignItems: 'center', gap: '7px', background: 'var(--blocked-bg)', border: '1px solid var(--blocked-border)', borderRadius: '6px', padding: '10px 12px', color: 'var(--blocked)', fontFamily: 'var(--mono)', fontSize: '12px', marginTop: '8px' },
  submitBtn: { marginTop: '20px', width: '100%', background: 'var(--accent)', border: 'none', borderRadius: '8px', padding: '14px', color: '#000', fontFamily: 'var(--mono)', fontSize: '12px', fontWeight: '700', letterSpacing: '0.1em', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', transition: 'opacity 0.15s' },
  footer: { marginTop: '24px', fontFamily: 'var(--mono)', fontSize: '9px', color: 'var(--muted)', textAlign: 'center', letterSpacing: '0.04em', lineHeight: '1.6' },

  // Loading overlay
  loadingOverlay: {
    position: 'absolute',
    inset: 0,
    background: 'var(--bg2)',
    zIndex: 10,
    display: 'flex',
    flexDirection: 'column',
    borderRadius: '16px',
    overflow: 'hidden',
  },
  progressTrack: {
    height: '3px',
    background: 'var(--border)',
    flexShrink: 0,
  },
  progressBar: {
    height: '100%',
    background: 'var(--accent)',
    transition: 'width 0.15s ease',
    boxShadow: '0 0 8px var(--accent)',
  },
  loadingContent: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '20px',
    padding: '40px',
  },
  shieldAnim: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '60px',
    height: '60px',
  },
  shieldRing: {
    position: 'absolute',
    inset: '-8px',
    border: '2px solid var(--accent)',
    borderRadius: '50%',
    animation: 'ringPulse 1.2s ease-out infinite',
  },
  loadingStep: {
    fontFamily: 'var(--mono)',
    fontSize: '12px',
    color: 'var(--text)',
    letterSpacing: '0.04em',
    textAlign: 'center',
    minHeight: '20px',
  },
  dotsRow: {
    display: 'flex',
    gap: '6px',
  },
  dot: {
    width: '6px',
    height: '6px',
    borderRadius: '50%',
    background: 'var(--accent)',
    animation: 'dotBounce 1s ease-in-out infinite',
  },
}