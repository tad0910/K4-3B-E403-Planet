import React, { useState, useEffect } from 'react';
import { X, Send, Bot, Sparkles } from 'lucide-react';

export default function AIReplyModal({ ticket, onClose, onSend }) {
  const [draft, setDraft] = useState('');

  useEffect(() => {
    if (ticket) {
      setDraft(ticket.aiDraftReply || '');
    }
  }, [ticket]);

  if (!ticket) return null;

  return (
    <div style={styles.overlay}>
      <div style={styles.modal}>
        {/* Modal Header */}
        <div style={styles.header}>
          <div style={styles.titleGroup}>
            <Bot size={20} color="#5865f2" />
            <span style={styles.title}>Trả lời nhanh bằng AI cho TA</span>
          </div>
          <button style={styles.closeBtn} onClick={onClose}>
            <X size={18} color="#949ba4" />
          </button>
        </div>

        {/* Modal Body */}
        <div style={styles.body}>
          <div style={styles.ticketMetaBox}>
            <span style={styles.studentLabel}>Gửi tới: <strong>{ticket.userName} ({ticket.studentId})</strong></span>
            <span style={styles.ticketTitleLabel}>Tiêu đề: <em>"{ticket.title}"</em></span>
          </div>

          <div style={styles.editorGroup}>
            <label style={styles.label}>
              <Sparkles size={14} color="#f0b232" />
              <span>Nội dung AI đã soạn nháp (TA có thể chỉnh sửa trước khi gửi):</span>
            </label>

            <textarea
              style={styles.textarea}
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              rows={8}
            />
          </div>
        </div>

        {/* Modal Footer */}
        <div style={styles.footer}>
          <button style={styles.cancelBtn} onClick={onClose}>
            Hủy bỏ
          </button>

          <button style={styles.sendBtn} onClick={() => onSend(ticket.id, draft)}>
            <Send size={15} />
            <span>Duyệt & Gửi tới Discord</span>
          </button>
        </div>
      </div>
    </div>
  );
}

const styles = {
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
    animation: 'fadeIn 0.2s ease'
  },
  modal: {
    backgroundColor: '#2b2d31',
    border: '1px solid var(--border-subtle)',
    borderRadius: '16px',
    width: '90%',
    maxWidth: '580px',
    overflow: 'hidden',
    boxShadow: '0 20px 50px rgba(0,0,0,0.6)',
    display: 'flex',
    flexDirection: 'column'
  },
  header: {
    padding: '16px 20px',
    borderBottom: '1px solid var(--border-subtle)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#1e1f22'
  },
  titleGroup: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px'
  },
  title: {
    fontSize: '16px',
    fontWeight: '700',
    color: '#ffffff'
  },
  closeBtn: {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    padding: '4px'
  },
  body: {
    padding: '20px',
    display: 'flex',
    flexDirection: 'column',
    gap: '16px'
  },
  ticketMetaBox: {
    backgroundColor: '#1e1f22',
    padding: '12px 14px',
    borderRadius: '8px',
    fontSize: '13px',
    color: 'var(--text-secondary)',
    display: 'flex',
    flexDirection: 'column',
    gap: '4px'
  },
  studentLabel: {
    color: '#ffffff'
  },
  ticketTitleLabel: {
    color: 'var(--text-muted)'
  },
  editorGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px'
  },
  label: {
    fontSize: '13px',
    fontWeight: '600',
    color: '#f0b232',
    display: 'flex',
    alignItems: 'center',
    gap: '6px'
  },
  textarea: {
    backgroundColor: '#1e1f22',
    border: '1px solid var(--border-subtle)',
    borderRadius: '8px',
    padding: '12px 14px',
    color: '#ffffff',
    fontSize: '14px',
    lineHeight: '1.6',
    resize: 'vertical',
    outline: 'none'
  },
  footer: {
    padding: '14px 20px',
    borderTop: '1px solid var(--border-subtle)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: '10px',
    backgroundColor: '#232428'
  },
  cancelBtn: {
    backgroundColor: 'transparent',
    color: 'var(--text-secondary)',
    border: 'none',
    padding: '8px 16px',
    borderRadius: '6px',
    fontSize: '13px',
    fontWeight: '600',
    cursor: 'pointer'
  },
  sendBtn: {
    backgroundColor: 'var(--accent-blurple)',
    color: '#ffffff',
    border: 'none',
    padding: '9px 18px',
    borderRadius: '6px',
    fontSize: '13px',
    fontWeight: '700',
    cursor: 'pointer',
    display: 'inline-flex',
    alignItems: 'center',
    gap: '8px',
    boxShadow: '0 4px 12px rgba(88, 101, 242, 0.3)'
  }
};
