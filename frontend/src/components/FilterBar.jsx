import React from 'react';
import { RotateCcw } from 'lucide-react';

export default function FilterBar({ activeCategory, onSelectCategory, onTriggerScan, countMap }) {
  const filters = [
    { id: 'all', label: `Tất cả (${countMap.all || 4})` },
    { id: 'urgent', label: 'Cảnh báo MISS (>2h)' },
    { id: 'cvat', label: 'Lỗi CVAT / Môi trường' },
    { id: 'logistics', label: 'Logistics / Deadline' }
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

      <button style={styles.triggerBtn} onClick={onTriggerScan}>
        <RotateCcw size={15} color="#ffffff" />
        <span>Quét lại ngay (Kích hoạt AI)</span>
      </button>
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
    background: '#383a40',
    border: 'none',
    color: 'var(--text-secondary)',
    padding: '7px 16px',
    borderRadius: '8px',
    fontSize: '13px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.15s ease'
  },
  activeBtn: {
    backgroundColor: 'var(--accent-blurple)',
    color: '#ffffff'
  },
  triggerBtn: {
    background: 'linear-gradient(135deg, #5865f2 0%, #4752c4 100%)',
    color: '#ffffff',
    border: 'none',
    padding: '9px 18px',
    borderRadius: '8px',
    fontWeight: '700',
    fontSize: '13px',
    cursor: 'pointer',
    display: 'inline-flex',
    alignItems: 'center',
    gap: '8px',
    boxShadow: '0 4px 14px rgba(88, 101, 242, 0.35)',
    transition: 'transform 0.15s ease'
  }
};
