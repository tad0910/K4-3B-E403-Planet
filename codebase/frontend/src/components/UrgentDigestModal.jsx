import React, { useState } from 'react';
import { X, Zap, Copy, Check, ExternalLink, AlertTriangle, Building, CheckCircle2 } from 'lucide-react';

export const isTicketUrgent = (ticket) => {
  if (!ticket) return false;
  if (ticket.statusType === 'urgent') return true;
  if (typeof ticket.waitTimeMinutes === 'number' && ticket.waitTimeMinutes >= 120) return true;
  const timeStr = (ticket.timeElapsed || '').toLowerCase();
  if (timeStr.includes('h')) {
    const hoursMatch = timeStr.match(/(\d+)\s*h/);
    if (hoursMatch) {
      const hours = parseInt(hoursMatch[1], 10);
      if (hours >= 2) return true;
    }
  }
  const minMatch = timeStr.match(/(\d+)\s*(m|phút)/);
  if (minMatch && !timeStr.includes('h')) {
    const mins = parseInt(minMatch[1], 10);
    if (mins >= 120) return true;
  }
  return false;
};

export default function UrgentDigestModal({ isOpen, onClose, tickets = [], onOpenOriginal, onResolve, onSelectTicket }) {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  // Lọc các nhóm ticket đồng bộ
  const urgentTickets = tickets.filter((t) => isTicketUrgent(t));
  const adminTickets = tickets.filter(
    (t) => t.category === 'logistics' || t.requiresAdmin || t.studentQuestion?.toLowerCase().includes('sửa điểm') || t.studentQuestion?.toLowerCase().includes('xin nghỉ')
  );
  const coachTickets = tickets.filter((t) => t.category === 'cvat' || t.category === 'prompt');

  // Tạo nội dung Markdown chuẩn Discord để copy
  const generateDiscordMarkdown = () => {
    const timeStr = new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
    let md = `📢 **[BẢN TIN CỨU HỘ KHẨN CẤP CHO TA DISCORD — ${timeStr}]**\n\n`;
    
    md += `🚨 **1. TICKET BỎ SÓT >2H CẦN CỨU GẤP (${urgentTickets.length} ca):**\n`;
    if (urgentTickets.length === 0) {
      md += `*Hiện không có ticket nào bị bỏ sót quá 2h!*\n`;
    } else {
      urgentTickets.forEach((t, i) => {
        md += `• **[#${t.id}] ${t.userName}** (Chờ: ${t.timeElapsed}) — *${t.title}*\n  👉 *Gợi ý:* ${t.aiSuggestedAction || 'Cần TA vào kiểm tra log'}\n`;
      });
    }

    md += `\n🏛️ **2. YÊU CẦU CHUYỂN BAN TỔ CHỨC / ADMIN (${adminTickets.length} ca):**\n`;
    if (adminTickets.length === 0) {
      md += `*Không có yêu cầu thủ tục/phúc khảo.*\n`;
    } else {
      adminTickets.forEach((t) => {
        md += `• **[#${t.id}] ${t.userName}**: ${t.title} ➔ *Cần Admin/BTC xử lý*\n`;
      });
    }

    md += `\n📊 **Tổng kết:** Đang mở ${tickets.length} ticket | Đã xử lý ${tickets.filter((t) => t.isResolved).length} ticket hôm nay.`;
    return md;
  };

  const handleCopy = () => {
    const text = generateDiscordMarkdown();
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  const handleNavigateToTicket = (t) => {
    if (onSelectTicket) {
      onSelectTicket(t);
    }
  };

  return (
    <div style={styles.overlay}>
      <div style={styles.modal}>
        {/* Header */}
        <div style={styles.header}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={styles.zapIconWrap}>
              <Zap size={20} color="#ffd700" />
            </div>
            <div>
              <h3 style={styles.title}>⚡ Bản tin Tóm tắt Khẩn cấp (/urgent-digest)</h3>
              <p style={styles.subtitle}>Tổng hợp nhanh các ticket cần cứu hộ gấp cho TA và Coach</p>
            </div>
          </div>
          <button onClick={onClose} style={styles.closeBtn}>
            <X size={20} color="#949ba4" />
          </button>
        </div>

        {/* Content Body */}
        <div style={styles.body}>
          {/* Section 1: Urgent Missed Tickets */}
          <div style={styles.sectionCard}>
            <div style={{ ...styles.sectionHeader, color: 'var(--danger-red)' }}>
              <AlertTriangle size={18} />
              <span>🚨 TICKET BỎ SÓT &gt;2H CẦN CỨU GẤP ({urgentTickets.length})</span>
            </div>
            <div style={styles.ticketList}>
              {urgentTickets.length > 0 ? (
                urgentTickets.map((t) => (
                  <div key={t.id} style={styles.urgentItem}>
                    <div style={{ flex: 1, cursor: 'pointer' }} onClick={() => handleNavigateToTicket(t)}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={styles.urgentId}>#{t.id}</span>
                        <strong style={{ color: '#fff', fontSize: '13px' }}>{t.userName}</strong>
                        <span style={styles.waitBadge}>Chờ: {t.timeElapsed}</span>
                      </div>
                      <p style={styles.itemTitle}>{t.title}</p>
                      <p style={styles.itemAction}>👉 {t.aiSuggestedAction}</p>
                    </div>
                    <div style={{ display: 'flex', gap: '6px' }}>
                      <button style={styles.navBtn} onClick={() => handleNavigateToTicket(t)}>
                        <span>Xem chi tiết</span>
                      </button>
                      <button style={styles.directBtn} onClick={() => onOpenOriginal(t)}>
                        <ExternalLink size={13} />
                        <span>Mở Discord</span>
                      </button>
                      <button style={styles.resolveBtn} onClick={() => onResolve(t.id)}>
                        <CheckCircle2 size={13} />
                        <span>Xong</span>
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div style={styles.emptyNotice}>
                  🎉 Tuyệt vời! Hiện không có ticket nào bị bỏ sót quá 2 tiếng.
                </div>
              )}
            </div>
          </div>

          {/* Section 2: Admin Tickets */}
          <div style={styles.sectionCard}>
            <div style={{ ...styles.sectionHeader, color: '#ff9800' }}>
              <Building size={18} />
              <span>🏛️ YÊU CẦU CẦN CHUYỂN BAN TỔ CHỨC / ADMIN ({adminTickets.length})</span>
            </div>
            <div style={styles.ticketList}>
              {adminTickets.length > 0 ? (
                adminTickets.map((t) => (
                  <div key={t.id} style={styles.adminItem}>
                    <div style={{ flex: 1, cursor: 'pointer' }} onClick={() => handleNavigateToTicket(t)}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={styles.adminId}>#{t.id}</span>
                        <strong style={{ color: '#fff', fontSize: '13px' }}>{t.userName}</strong>
                      </div>
                      <p style={styles.itemTitle}>{t.title}</p>
                    </div>
                    <div style={{ display: 'flex', gap: '6px' }}>
                      <button style={styles.navBtn} onClick={() => handleNavigateToTicket(t)}>
                        <span>Xem Ticket</span>
                      </button>
                      <button style={styles.forwardBtn} onClick={() => onResolve(t.id)}>
                        <span>Chuyển BTC & Đóng</span>
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div style={styles.emptyNotice}>Không có yêu cầu thủ tục hoặc phúc khảo nào.</div>
              )}
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div style={styles.footer}>
          <div style={styles.footerSummary}>
            <span>Đang theo dõi <strong>{tickets.length}</strong> ticket mở</span>
          </div>

          <div style={{ display: 'flex', gap: '10px' }}>
            <button style={styles.copyBtn} onClick={handleCopy}>
              {copied ? <Check size={16} color="#23a55a" /> : <Copy size={16} />}
              <span>{copied ? 'Đã sao chép vào Clipboard!' : '📋 Sao chép Bản tin Discord'}</span>
            </button>

            <button style={styles.closeModalBtn} onClick={onClose}>
              Đóng
            </button>
          </div>
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
    zIndex: 9999
  },
  modal: {
    backgroundColor: '#313338',
    borderRadius: '12px',
    width: '680px',
    maxWidth: '92vw',
    maxHeight: '85vh',
    display: 'flex',
    flexDirection: 'column',
    boxShadow: '0 12px 36px rgba(0, 0, 0, 0.6)',
    border: '1px solid var(--border-subtle)',
    overflow: 'hidden'
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '18px 24px',
    borderBottom: '1px solid var(--border-subtle)',
    backgroundColor: '#2b2d31'
  },
  zapIconWrap: {
    width: '36px',
    height: '36px',
    borderRadius: '8px',
    backgroundColor: 'rgba(255, 215, 0, 0.15)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  title: {
    fontSize: '16px',
    fontWeight: '800',
    color: '#ffffff',
    margin: 0
  },
  subtitle: {
    fontSize: '12px',
    color: 'var(--text-muted)',
    margin: '2px 0 0'
  },
  closeBtn: {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    padding: '4px'
  },
  body: {
    padding: '20px 24px',
    overflowY: 'auto',
    display: 'flex',
    flexDirection: 'column',
    gap: '16px'
  },
  sectionCard: {
    backgroundColor: '#2b2d31',
    borderRadius: '10px',
    border: '1px solid var(--border-subtle)',
    padding: '14px 16px',
    display: 'flex',
    flexDirection: 'column',
    gap: '10px'
  },
  sectionHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontSize: '13px',
    fontWeight: '800',
    letterSpacing: '0.3px'
  },
  ticketList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px'
  },
  urgentItem: {
    backgroundColor: 'rgba(242, 63, 67, 0.08)',
    borderLeft: '3px solid var(--danger-red)',
    padding: '10px 12px',
    borderRadius: '6px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '12px'
  },
  urgentId: {
    fontSize: '11px',
    fontWeight: '700',
    backgroundColor: 'rgba(242, 63, 67, 0.2)',
    color: 'var(--danger-red)',
    padding: '2px 6px',
    borderRadius: '4px'
  },
  waitBadge: {
    fontSize: '11px',
    color: 'var(--danger-red)',
    fontWeight: '700'
  },
  itemTitle: {
    fontSize: '13px',
    color: 'var(--text-primary)',
    margin: '4px 0 2px',
    fontWeight: '600'
  },
  itemAction: {
    fontSize: '12px',
    color: '#f0b232',
    margin: 0
  },
  navBtn: {
    backgroundColor: '#383a40',
    color: '#ffffff',
    border: '1px solid var(--border-subtle)',
    padding: '6px 10px',
    borderRadius: '6px',
    fontSize: '12px',
    fontWeight: '600',
    cursor: 'pointer',
    display: 'inline-flex',
    alignItems: 'center',
    gap: '4px',
    whiteSpace: 'nowrap'
  },
  directBtn: {
    backgroundColor: 'var(--accent-blurple)',
    color: '#ffffff',
    border: 'none',
    padding: '6px 12px',
    borderRadius: '6px',
    fontSize: '12px',
    fontWeight: '700',
    cursor: 'pointer',
    display: 'inline-flex',
    alignItems: 'center',
    gap: '5px',
    whiteSpace: 'nowrap'
  },
  resolveBtn: {
    backgroundColor: 'var(--success-green)',
    color: '#ffffff',
    border: 'none',
    padding: '6px 10px',
    borderRadius: '6px',
    fontSize: '12px',
    fontWeight: '700',
    cursor: 'pointer',
    display: 'inline-flex',
    alignItems: 'center',
    gap: '4px',
    whiteSpace: 'nowrap'
  },
  adminItem: {
    backgroundColor: 'rgba(255, 152, 0, 0.08)',
    borderLeft: '3px solid #ff9800',
    padding: '10px 12px',
    borderRadius: '6px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '12px'
  },
  adminId: {
    fontSize: '11px',
    fontWeight: '700',
    backgroundColor: 'rgba(255, 152, 0, 0.2)',
    color: '#ff9800',
    padding: '2px 6px',
    borderRadius: '4px'
  },
  forwardBtn: {
    backgroundColor: '#ff9800',
    color: '#ffffff',
    border: 'none',
    padding: '6px 12px',
    borderRadius: '6px',
    fontSize: '12px',
    fontWeight: '700',
    cursor: 'pointer',
    whiteSpace: 'nowrap'
  },
  emptyNotice: {
    fontSize: '12px',
    color: 'var(--text-muted)',
    padding: '6px 0',
    fontStyle: 'italic'
  },
  footer: {
    padding: '14px 24px',
    borderTop: '1px solid var(--border-subtle)',
    backgroundColor: '#2b2d31',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  footerSummary: {
    fontSize: '12px',
    color: 'var(--text-secondary)'
  },
  copyBtn: {
    backgroundColor: 'linear-gradient(135deg, #7c3aed 0%, #4f46e5 100%)',
    background: '#5865f2',
    color: '#ffffff',
    border: 'none',
    padding: '8px 16px',
    borderRadius: '6px',
    fontSize: '13px',
    fontWeight: '700',
    cursor: 'pointer',
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px'
  },
  closeModalBtn: {
    backgroundColor: 'transparent',
    color: 'var(--text-secondary)',
    border: '1px solid var(--border-subtle)',
    padding: '8px 16px',
    borderRadius: '6px',
    fontSize: '13px',
    cursor: 'pointer'
  }
};
