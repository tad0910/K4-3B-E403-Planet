import React from 'react';
import { RotateCcw, Zap, Sparkles } from 'lucide-react';

export default function FilterBar({ activeCategory, onSelectCategory, onTriggerScan, onOpenDigest, countMap = {} }) {
  const filters = [
    { id: 'all', label: `Tất cả (${countMap.all || 0})` },
    { id: 'urgent', label: `🚨 Cần cứu gấp >2h (${countMap.urgent || 0})` },
    { id: 'cvat', label: `🛠️ Việc của Lab Coach (${countMap.coach || 0})` },
    { id: 'logistics', label: `🏛️ Chuyển BTC/Admin (${countMap.admin || 0})` }
  ];

  return (
    <div style={styles.container}>
      <div style={styles.filterGroup}>
        {filters.map((f) => {
          const isActive = activeCategory === f.id;
          return (
            <button
              key={f.id}
              onClick={() => onSelectCategory(f.id)}
              style={{
                ...styles.filterBtn,
                ...(isActive ? styles.activeBtn : {})
              }}
            >
              {f.label}
            </button>
          );
        })}
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <button style={styles.digestBtn} onClick={onOpenDigest}>
          <Zap size={15} color="#ffd700" />
          <span>⚡ Bản tin Tóm tắt (/digest)</span>
        </button>

        <button style={styles.triggerBtn} onClick={onTriggerScan}>
          <RotateCcw size={14} color="#ffffff" />
          <span>Quét lại AI</span>
        </button>
      </div>
    </div>
  );
}

const styles = {
  container: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '12px',
    backgroundColor: '#2b2d31',
    padding: '12px 16px',
    borderRadius: '12px',
    border: '1px solid var(--border-subtle)',
    userSelect: 'none'
  },
  filterGroup: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px'
  },
  filterBtn: {
    backgroundColor: '#383a40',
    border: 'none',
    color: 'var(--text-secondary)',
    padding: '7px 16px',
    borderRadius: '8px',
    fontSize: '13px',
    fontWeight: '600',
    cursor: 'pointer',
    outline: 'none',
    transition: 'all 0.15s ease'
  },
  activeBtn: {
    backgroundColor: 'var(--accent-blurple)',
    color: '#ffffff'
  },
  digestBtn: {
    background: 'linear-gradient(135deg, #7c3aed 0%, #d97706 100%)',
    color: '#ffffff',
    border: 'none',
    padding: '8px 16px',
    borderRadius: '8px',
    fontWeight: '700',
    fontSize: '13px',
    cursor: 'pointer',
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
    boxShadow: '0 4px 12px rgba(124, 58, 237, 0.35)',
    transition: 'transform 0.15s ease'
  },
  triggerBtn: {
    background: 'linear-gradient(135deg, #5865f2 0%, #4752c4 100%)',
    color: '#ffffff',
    border: 'none',
    padding: '8px 14px',
    borderRadius: '8px',
    fontWeight: '700',
    fontSize: '13px',
    cursor: 'pointer',
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
    boxShadow: '0 4px 14px rgba(88, 101, 242, 0.35)',
    transition: 'transform 0.15s ease'
  }
};
