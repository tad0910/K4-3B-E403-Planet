import React from 'react';
import { Bot, Settings, Plus } from 'lucide-react';

export default function ServerSidebar() {
  return (
    <aside style={styles.sidebar}>
      {/* Active Server Icon */}
      <div style={styles.activePillContainer}>
        <div style={styles.activePill} />
        <div style={{ ...styles.serverIcon, ...styles.activeIcon }} title="K4 - Lớp 3B - E403">
          AI
        </div>
      </div>

      <div style={styles.divider} />

      {/* Secondary Bot Icon */}
      <div style={styles.iconWrapper} title="Discord Assistant Bot">
        <div style={styles.serverIcon}>
          <Bot size={22} color="#b5bac1" />
        </div>
      </div>

      <div style={styles.iconWrapper} title="Thêm Kênh">
        <div style={styles.addIcon}>
          <Plus size={20} color="#23a55a" />
        </div>
      </div>

      {/* Bottom Settings */}
      <div style={styles.bottomSection}>
        <div style={styles.iconWrapper} title="Cài đặt hệ thống">
          <div style={styles.settingsIcon}>
            <Settings size={20} color="#949ba4" />
          </div>
        </div>
      </div>
    </aside>
  );
}

const styles = {
  sidebar: {
    width: '72px',
    backgroundColor: 'var(--bg-darkest)',
    padding: '12px 0',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '8px',
    borderRight: '1px solid #111214',
    userSelect: 'none',
    zIndex: 10
  },
  activePillContainer: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%'
  },
  activePill: {
    position: 'absolute',
    left: 0,
    width: '4px',
    height: '40px',
    backgroundColor: '#ffffff',
    borderRadius: '0 4px 4px 0'
  },
  serverIcon: {
    width: '48px',
    height: '48px',
    borderRadius: '16px',
    backgroundColor: '#313338',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: '800',
    fontSize: '18px',
    color: '#ffffff',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    boxShadow: '0 4px 12px rgba(88, 101, 242, 0.3)'
  },
  activeIcon: {
    background: 'linear-gradient(135deg, #5865f2 0%, #eb459e 100%)',
    borderRadius: '16px'
  },
  divider: {
    width: '32px',
    height: '2px',
    backgroundColor: '#35363c',
    margin: '4px 0'
  },
  iconWrapper: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%'
  },
  addIcon: {
    width: '48px',
    height: '48px',
    borderRadius: '50%',
    backgroundColor: '#313338',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    transition: 'all 0.2s ease'
  },
  bottomSection: {
    marginTop: 'auto',
    display: 'flex',
    flexDirection: 'column',
    gap: '8px'
  },
  settingsIcon: {
    width: '48px',
    height: '48px',
    borderRadius: '50%',
    backgroundColor: '#2b2d31',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer'
  }
};
