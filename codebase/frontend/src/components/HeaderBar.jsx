import React from 'react';
import { Hash } from 'lucide-react';

export default function HeaderBar() {
  return (
    <header style={styles.header}>
      <div style={styles.titleGroup}>
        <Hash size={20} color="#f2f3f5" />
        <span style={styles.title}>cảnh báo ticket bỏ sót</span>
        <span style={styles.subtitle}>Bảng điều khiển cứu hộ học viên bị trôi bài cho TA Discord</span>
      </div>

      <div style={styles.rightGroup}>
        {/* Quick Legend Bar */}
        <div style={styles.legendBar}>
          <span style={styles.legendItem}>
            <span style={{ ...styles.legendDot, backgroundColor: 'var(--danger-red)' }} />
            <span>&gt;2h: Cần cứu gấp</span>
          </span>
          <span style={styles.legendDivider}>•</span>
          <span style={styles.legendItem}>
            <span style={{ ...styles.legendDot, backgroundColor: 'var(--warning-yellow)' }} />
            <span>1–2h: Cần chú ý</span>
          </span>
          <span style={styles.legendDivider}>•</span>
          <span style={styles.legendItem}>
            <span style={{ ...styles.legendDot, backgroundColor: 'var(--success-green)' }} />
            <span>&lt;1h: Mới tạo</span>
          </span>
        </div>

        <div style={styles.aiStatusPill}>
          <span style={styles.statusDot} />
          <span style={styles.aiStatusText}>
            AI Agent: <strong style={{ color: '#23a55a' }}>Đang quét</strong>
          </span>
        </div>
      </div>
    </header>
  );
}

const styles = {
  header: {
    height: '52px',
    padding: '0 20px',
    borderBottom: '1px solid var(--border-subtle)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'var(--bg-chat)',
    userSelect: 'none'
  },
  titleGroup: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px'
  },
  title: {
    fontWeight: '800',
    fontSize: '16px',
    color: '#ffffff'
  },
  subtitle: {
    color: 'var(--text-muted)',
    fontSize: '13px',
    fontWeight: '400',
    marginLeft: '6px'
  },
  rightGroup: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px'
  },
  legendBar: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    backgroundColor: '#1e1f22',
    padding: '4px 12px',
    borderRadius: '16px',
    border: '1px solid var(--border-subtle)',
    fontSize: '11px',
    fontWeight: '600',
    color: 'var(--text-secondary)'
  },
  legendItem: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '5px'
  },
  legendDot: {
    width: '7px',
    height: '7px',
    borderRadius: '50%'
  },
  legendDivider: {
    color: 'var(--text-muted)',
    opacity: 0.5
  },
  aiStatusPill: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '8px',
    backgroundColor: 'rgba(35, 165, 90, 0.1)',
    border: '1px solid rgba(35, 165, 90, 0.3)',
    color: 'var(--text-primary)',
    padding: '5px 14px',
    borderRadius: '20px',
    fontSize: '12px'
  },
  statusDot: {
    width: '8px',
    height: '8px',
    borderRadius: '50%',
    backgroundColor: 'var(--success-green)',
    animation: 'pulse 2s infinite'
  },
  aiStatusText: {
    fontSize: '12px',
    color: '#ffffff'
  }
};
