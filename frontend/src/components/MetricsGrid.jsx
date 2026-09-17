import React from 'react';
import { Mail, Zap, CheckCircle2, RotateCw } from 'lucide-react';

export default function MetricsGrid({ metrics }) {
  return (
    <div style={styles.grid}>
      {/* Metric 1 */}
      <div style={styles.card}>
        <div style={styles.cardHeader}>
          <span style={styles.title}>Tổng Ticket đang mở</span>
          <Mail size={18} color="#949ba4" />
        </div>
        <span style={styles.value}>{metrics.totalOpen}</span>
      </div>

      {/* Metric 2 */}
      <div style={styles.card}>
        <div style={styles.cardHeader}>
          <span style={styles.title}>Ticket bị MISS (&gt;2h)</span>
          <Zap size={18} color="#f23f43" />
        </div>
        <span style={{ ...styles.value, color: 'var(--danger-red)' }}>
          {metrics.missedUrgent}
        </span>
      </div>

      {/* Metric 3 */}
      <div style={styles.card}>
        <div style={styles.cardHeader}>
          <span style={styles.title}>Đã hỗ trợ hôm nay</span>
          <CheckCircle2 size={18} color="#23a55a" />
        </div>
        <span style={{ ...styles.value, color: 'var(--success-green)' }}>
          {metrics.resolvedToday}
        </span>
      </div>

      {/* Metric 4 */}
      <div style={styles.card}>
        <div style={styles.cardHeader}>
          <span style={styles.title}>Thời gian phản hồi TB</span>
          <RotateCw size={18} color="#5865f2" />
        </div>
        <span style={{ ...styles.value, fontSize: '24px' }}>
          {metrics.avgResponseTime}
        </span>
      </div>
    </div>
  );
}

const styles = {
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: '14px',
    userSelect: 'none'
  },
  card: {
    backgroundColor: '#2b2d31',
    border: '1px solid var(--border-subtle)',
    padding: '16px 20px',
    borderRadius: '12px',
    display: 'flex',
    flexDirection: 'column',
    gap: '8px'
  },
  cardHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  title: {
    fontSize: '12px',
    color: 'var(--text-muted)',
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: '0.2px'
  },
  value: {
    fontSize: '28px',
    fontWeight: '800',
    color: '#ffffff'
  }
};
