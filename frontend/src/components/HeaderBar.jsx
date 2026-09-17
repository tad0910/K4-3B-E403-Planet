import React from 'react';
import { Hash } from 'lucide-react';

export default function HeaderBar() {
  return (
    <header style={styles.header}>
      <div style={styles.titleGroup}>
        <Hash size={20} color="#f2f3f5" />
        <span style={styles.title}>ta-missed-ticket-alert</span>
        <span style={styles.subtitle}>Bảng điều khiển Ticket bị bỏ sót & Cảnh báo khẩn cấp cho TA</span>
      </div>

      <div style={styles.aiStatusPill}>
        <span style={styles.statusDot} />
        <span style={styles.aiStatusText}>
          AI Agent: <strong style={{ color: '#23a55a' }}>Đang hoạt động</strong> <span style={{ opacity: 0.7 }}>(Quét mỗi 30 phút)</span>
        </span>
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
