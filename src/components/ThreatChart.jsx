import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts'

const COLORS = ['#ef4444', '#f59e0b', '#3b82f6', '#22c55e', '#a855f7', '#06b6d4', '#f97316']

export default function ThreatChart({ alerts }) {
  const registry = {}
  alerts.forEach((item) => {
    const categories = item.topReasons || [item.verdict || 'SAFE']
    categories.forEach((c) => { registry[c] = (registry[c] || 0) + 1 })
  })

  const chartData = Object.entries(registry)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value)

  const fallbackData = chartData.length > 0
    ? chartData
    : [{ name: 'No incident logs', value: 1 }]

  return (
    <div style={styles.card}>
      <style>{`
        @media (max-width: 768px) {
          .sg-chart-wrap { height: 250px !important; min-height: 250px !important; }
        }
      `}</style>

      <div style={styles.header}>
        <span style={styles.title}>Threat Distribution</span>
        <span style={styles.count}>{chartData.length} categories</span>
      </div>

      <div className="sg-chart-wrap" style={styles.chartWrap}>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={fallbackData}
              dataKey="value"
              nameKey="name"
              outerRadius={90}
              innerRadius={58}
              paddingAngle={3}
              label={false}
              strokeWidth={0}
            >
              {fallbackData.map((_, i) => (
                <Cell
                  key={i}
                  fill={COLORS[i % COLORS.length]}
                  stroke="var(--bg2)"
                  strokeWidth={2}
                />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>

        {/* Center label */}
        <div style={styles.centerLabel}>
          <div style={styles.centerValue}>{alerts.length}</div>
          <div style={styles.centerText}>total</div>
        </div>
      </div>

      {/* Legend */}
      <div style={styles.legend}>
        {fallbackData.map((entry, i) => {
          const pct = alerts.length > 0
            ? Math.round((entry.value / alerts.length) * 100)
            : 0
          return (
            <div key={i} style={styles.legendRow}>
              <div style={{ ...styles.legendDot, background: COLORS[i % COLORS.length] }} />
              <span style={styles.legendName}>{entry.name}</span>
              <div style={styles.legendRight}>
                <span style={styles.legendCount}>{entry.value}</span>
                <div style={styles.barTrack}>
                  <div style={{ ...styles.barFill, width: `${pct}%`, background: COLORS[i % COLORS.length] }} />
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

const styles = {
  card: {
    background: 'var(--bg2)',
    border: '1px solid var(--border)',
    borderRadius: '14px',
    padding: '22px',
    height: 'auto',
    display: 'flex',
    flexDirection: 'column',
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: '16px',
  },
  title: {
    fontFamily: 'var(--mono)',
    fontSize: '10px',
    color: 'var(--muted)',
    textTransform: 'uppercase',
    letterSpacing: '0.1em',
  },
  count: {
    fontFamily: 'var(--mono)',
    fontSize: '10px',
    color: 'var(--border2)',
    background: 'var(--bg3)',
    padding: '2px 8px',
    borderRadius: '4px',
    border: '1px solid var(--border)',
  },
  chartWrap: {
    height: '200px',
    minHeight: '200px',
    position: 'relative',
    flexShrink: 0,
  },
  centerLabel: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    textAlign: 'center',
    pointerEvents: 'none',
    zIndex: 10,
    background: 'var(--bg2)',
    borderRadius: '50%',
    width: '72px',
    height: '72px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  centerValue: {
    fontSize: '28px',
    fontWeight: '800',
    lineHeight: 1,
    color: 'var(--text)',
  },
  centerText: {
    fontFamily: 'var(--mono)',
    fontSize: '10px',
    color: 'var(--muted)',
    marginTop: '2px',
  },
  legend: {
    marginTop: '12px',
    borderTop: '1px solid var(--border)',
    paddingTop: '14px',
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
    overflowY: 'auto',
  },
  legendRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  legendDot: {
    width: '8px',
    height: '8px',
    borderRadius: '2px',
    flexShrink: 0,
  },
  legendName: {
    fontFamily: 'var(--mono)',
    fontSize: '11px',
    color: 'var(--text)',
    flex: 1,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
  legendRight: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    flexShrink: 0,
  },
  legendCount: {
    fontFamily: 'var(--mono)',
    fontSize: '11px',
    color: 'var(--muted)',
    minWidth: '24px',
    textAlign: 'right',
  },
  barTrack: {
    width: '48px',
    height: '3px',
    background: 'var(--border)',
    borderRadius: '2px',
    overflow: 'hidden',
  },
  barFill: {
    height: '100%',
    borderRadius: '2px',
    transition: 'width 0.4s ease',
  },
}