import React from 'react';
import { ChevronDown, Hash, Volume2, Mic, Headphones, Settings } from 'lucide-react';

export default function ChannelSidebar({ badgeCount = 4 }) {
  return (
    <aside style={styles.sidebar}>
      {/* Server Header */}
      <div style={styles.serverHeader}>
        <span style={styles.serverTitle}>K4 - Lớp 3B - E403</span>
        <ChevronDown size={18} color="#b5bac1" />
      </div>

      {/* Channel Groups */}
      <div style={styles.channelContainer}>
        {/* Category 1: KÊNH VĂN BẢN */}
        <div style={styles.categoryTitle}>KÊNH VĂN BẢN</div>

        <div style={{ ...styles.channelItem, ...styles.activeChannel }}>
          <div style={styles.channelNameGroup}>
            <span style={styles.alertIcon}>🚨</span>
            <Hash size={16} color="#ffffff" style={{ marginLeft: 2 }} />
            <span style={styles.channelActiveText}>cảnh báo ticket bỏ sót</span>
          </div>
          {badgeCount > 0 && <span style={styles.badge}>{badgeCount}</span>}
        </div>

        {/* Category 2: KÊNH THOẠI */}
        <div style={{ ...styles.categoryTitle, marginTop: '20px' }}>KÊNH THOẠI</div>

        <div style={styles.channelItem}>
          <div style={styles.channelNameGroup}>
            <Volume2 size={16} color="#949ba4" />
            <span style={styles.channelText}>Họp nhanh TA</span>
          </div>
        </div>
      </div>

      {/* User Footer Profile */}
      <div style={styles.userFooter}>
        <div style={styles.userAvatarContainer}>
          <div style={styles.userAvatar}>LN</div>
          <div style={styles.onlineDot} />
        </div>

        <div style={styles.userInfo}>
          <span style={styles.userName}>Linh Nguyễn</span>
          <span style={styles.userStatus}>Đang online</span>
        </div>

        <div style={styles.userControls}>
          <Mic size={16} color="#b5bac1" style={styles.controlBtn} />
          <Headphones size={16} color="#b5bac1" style={styles.controlBtn} />
          <Settings size={16} color="#b5bac1" style={styles.controlBtn} />
        </div>
      </div>
    </aside>
  );
}

const styles = {
  sidebar: {
    width: '240px',
    backgroundColor: 'var(--bg-sidebar)',
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    borderRight: '1px solid #1f2023',
    userSelect: 'none'
  },
  serverHeader: {
    height: '52px',
    padding: '0 16px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    fontWeight: '700',
    fontSize: '15px',
    color: '#ffffff',
    borderBottom: '1px solid rgba(0,0,0,0.3)',
    boxShadow: '0 1px 2px rgba(0,0,0,0.2)',
    cursor: 'pointer'
  },
  serverTitle: {
    letterSpacing: '-0.2px'
  },
  channelContainer: {
    flex: 1,
    padding: '16px 8px',
    overflowY: 'auto'
  },
  categoryTitle: {
    fontSize: '11px',
    fontWeight: '700',
    color: 'var(--text-muted)',
    textTransform: 'uppercase',
    padding: '0 8px 6px',
    letterSpacing: '0.5px'
  },
  channelItem: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '7px 10px',
    borderRadius: '4px',
    color: 'var(--text-secondary)',
    fontSize: '14px',
    fontWeight: '500',
    cursor: 'pointer',
    marginBottom: '2px',
    transition: 'all 0.15s ease'
  },
  activeChannel: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    color: '#ffffff'
  },
  channelNameGroup: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px'
  },
  alertIcon: {
    fontSize: '13px'
  },
  channelActiveText: {
    fontWeight: '600',
    color: '#ffffff'
  },
  channelText: {
    color: 'var(--text-secondary)'
  },
  badge: {
    backgroundColor: 'var(--danger-red)',
    color: '#ffffff',
    fontSize: '11px',
    fontWeight: '800',
    padding: '2px 7px',
    borderRadius: '10px'
  },
  userFooter: {
    height: '54px',
    backgroundColor: '#232428',
    padding: '0 10px',
    display: 'flex',
    alignItems: 'center',
    gap: '8px'
  },
  userAvatarContainer: {
    position: 'relative'
  },
  userAvatar: {
    width: '32px',
    height: '32px',
    borderRadius: '50%',
    backgroundColor: '#ff9800',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: '700',
    fontSize: '13px',
    color: '#ffffff'
  },
  onlineDot: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: '10px',
    height: '10px',
    borderRadius: '50%',
    backgroundColor: 'var(--success-green)',
    border: '2px solid #232428'
  },
  userInfo: {
    display: 'flex',
    flexDirection: 'column',
    flex: 1,
    overflow: 'hidden'
  },
  userName: {
    fontSize: '13px',
    fontWeight: '700',
    color: '#ffffff',
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis',
    overflow: 'hidden'
  },
  userStatus: {
    fontSize: '11px',
    color: 'var(--text-muted)'
  },
  userControls: {
    display: 'flex',
    alignItems: 'center',
    gap: '4px'
  },
  controlBtn: {
    cursor: 'pointer',
    padding: '4px',
    borderRadius: '4px'
  }
};
