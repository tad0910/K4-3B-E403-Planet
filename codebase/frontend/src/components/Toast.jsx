import React from 'react';

export default function Toast({ message }) {
  if (!message) return null;

  return (
    <div style={styles.toast}>
      <span>{message}</span>
    </div>
  );
}

const styles = {
  toast: {
    position: 'fixed',
    bottom: '24px',
    right: '24px',
    backgroundColor: 'var(--bg-sidebar)',
    border: '1px solid var(--accent-blurple)',
    color: '#ffffff',
    padding: '14px 22px',
    borderRadius: '10px',
    fontSize: '14px',
    fontWeight: '600',
    boxShadow: '0 10px 30px rgba(0,0,0,0.6)',
    animation: 'slideUp 0.3s ease',
    zIndex: 2000
  }
};
