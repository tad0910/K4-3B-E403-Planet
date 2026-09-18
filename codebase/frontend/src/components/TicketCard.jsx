import React from 'react';
import { ExternalLink, Zap, CheckCircle2, Bot, Star, Puzzle } from 'lucide-react';

export default function TicketCard({ ticket, onOpenModal, onResolve, onOpenOriginal }) {
  // Determine Left Border Color & Badge Colors based on statusType
  let borderColor = 'var(--accent-blurple)';
  let tagBg = 'rgba(88, 101, 242, 0.15)';
  let tagColor = 'var(--accent-blurple)';
  let cleanStatusTag = ticket.statusTag;

  if (ticket.statusType === 'urgent') {
    borderColor = 'var(--danger-red)';
    tagBg = 'rgba(242, 63, 67, 0.15)';
    tagColor = 'var(--danger-red)';
    cleanStatusTag = `🚨 BỎ SÓT >2H (${ticket.timeElapsed})`;
  } else if (ticket.statusType === 'warning') {
    borderColor = 'var(--warning-yellow)';
    tagBg = 'rgba(240, 178, 50, 0.15)';
    tagColor = 'var(--warning-yellow)';
    cleanStatusTag = `🟡 CẦN CHÚ Ý (${ticket.timeElapsed})`;
  } else if (ticket.statusType === 'new') {
    borderColor = 'var(--success-green)';
    tagBg = 'rgba(35, 165, 90, 0.15)';
    tagColor = 'var(--success-green)';
    cleanStatusTag = `🟢 MỚI TẠO (${ticket.timeElapsed})`;
  }

  // Determine Assigned Role
  let assignedRole = { label: '👨‍🏫 Lab Coach / TA Kỹ thuật', color: '#5865f2', bg: 'rgba(88, 101, 242, 0.15)' };
  if (ticket.category === 'logistics' || ticket.requiresAdmin || ticket.studentQuestion?.toLowerCase().includes('sửa điểm') || ticket.studentQuestion?.toLowerCase().includes('phúc khảo') || ticket.studentQuestion?.toLowerCase().includes('xin nghỉ')) {
    assignedRole = { label: '🏛️ Ban Tổ Chức / Admin Lớp', color: '#ff9800', bg: 'rgba(255, 152, 0, 0.15)' };
  } else if (ticket.studentQuestion?.toLowerCase().includes('chuột') || ticket.studentQuestion?.toLowerCase().includes('bàn phím') || ticket.studentQuestion?.toLowerCase().includes('mạng lan')) {
    assignedRole = { label: '🔧 Kỹ thuật Phòng máy', color: '#00bcd4', bg: 'rgba(0, 188, 212, 0.15)' };
  } else if (ticket.category === 'prompt' && ticket.statusType !== 'urgent') {
    assignedRole = { label: '👥 Học viên hỗ trợ / FAQ', color: '#23a55a', bg: 'rgba(35, 165, 90, 0.15)' };
  }

  return (
    <div style={{ ...styles.card, borderLeftColor: borderColor }}>
      {/* Top Header Row */}
      <div style={styles.cardHeader}>
        <div style={styles.userMeta}>
          <div style={{ ...styles.avatar, backgroundColor: ticket.avatarBg }}>
            {ticket.userInitials}
          </div>

          <div style={styles.tagPillContainer}>
            <span style={{ ...styles.tagPill, backgroundColor: tagBg, color: tagColor }}>
              {cleanStatusTag}
            </span>
            {/* Assigned Role Badge */}
            <span style={{ ...styles.roleBadge, backgroundColor: assignedRole.bg, color: assignedRole.color }}>
              Gửi tới: <strong>{assignedRole.label}</strong>
            </span>
            <span style={styles.ticketId}>{ticket.id}</span>
          </div>
        </div>

        <div style={styles.timeBadge}>
          <span style={styles.timeDot}>🔴</span>
          <span>Chờ: {ticket.timeElapsed}</span>
        </div>
      </div>

      {/* Ticket Title */}
      <h3 style={styles.ticketTitle}>{ticket.title}</h3>

      {/* User Info Subline */}
      <div style={styles.userSubline}>
        <span>{ticket.userName}</span>
        <span>•</span>
        <span>{ticket.studentId}</span>
        <span>•</span>
        <span style={styles.channelName}>{ticket.channel}</span>
      </div>

      {/* Student Question Text */}
      <p style={styles.studentQuestion}>"{ticket.studentQuestion}"</p>

      {/* AI Summary Dashboard Box */}
      <div style={styles.aiBox}>
        <div style={styles.aiHeaderGroup}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Bot size={16} color="#5865f2" />
            <span style={styles.aiTitle}>AI Tóm tắt & Đề xuất hành động</span>
          </div>

          {ticket.isAnalyzed ? (
            <div style={styles.liveAiBadge}>
              <span style={styles.liveDot}></span>
              <span>Live AI ({ticket.aiModel || 'gpt-4o-mini'} · {ticket.aiLatency || '1.4s'})</span>
            </div>
          ) : (
            <span style={styles.pendingBadge}>Chờ AI phân tích</span>
          )}
        </div>

        <p style={styles.aiSummaryText}>
          {ticket.aiSummary}
        </p>

        <div style={styles.aiActionRow}>
          <Star size={14} color="#f0b232" style={{ flexShrink: 0 }} />
          <span style={styles.aiActionLabel}>Gợi ý xử lý:</span>
          <span style={styles.aiActionVal}>{ticket.aiSuggestedAction}</span>
        </div>

        {/* Source Citation Badge */}
        <div style={styles.sourcePill}>
          <Puzzle size={12} color="#8b5cf6" />
          <span>{ticket.sourceCitation || 'Trích từ: Discord K4 Live Data'}</span>
        </div>
      </div>

      {/* Bottom Actions Bar */}
      <div style={styles.actionsRow}>
        <button style={styles.btnDirect} onClick={() => onOpenOriginal(ticket)}>
          <ExternalLink size={14} />
          <span>🔗 Mở trực tiếp trên Discord</span>
        </button>

        <button style={styles.btnOutline} onClick={() => onOpenModal(ticket)}>
          <Zap size={14} color="#f0b232" />
          <span>Xem câu trả lời AI</span>
        </button>

        <button style={styles.btnSuccess} onClick={() => onResolve(ticket.id)}>
          <CheckCircle2 size={15} />
          <span>Đánh dấu đã xử lý</span>
        </button>
      </div>
    </div>
  );
}

const styles = {
  card: {
    backgroundColor: 'var(--bg-card)',
    border: '1px solid var(--border-subtle)',
    borderLeftWidth: '4px',
    borderRadius: '12px',
    padding: '20px',
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    transition: 'all 0.15s ease',
    marginBottom: '14px'
  },
  cardHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  userMeta: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px'
  },
  avatar: {
    width: '36px',
    height: '36px',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: '800',
    fontSize: '13px',
    color: '#ffffff'
  },
  tagPillContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    flexWrap: 'wrap'
  },
  tagPill: {
    fontSize: '11px',
    fontWeight: '800',
    padding: '4px 10px',
    borderRadius: '12px',
    letterSpacing: '0.2px'
  },
  roleBadge: {
    fontSize: '11px',
    padding: '4px 9px',
    borderRadius: '12px',
    display: 'inline-flex',
    alignItems: 'center',
    gap: '4px'
  },
  ticketId: {
    fontSize: '12px',
    color: 'var(--text-muted)',
    fontWeight: '600'
  },
  timeBadge: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    fontSize: '12px',
    fontWeight: '700',
    color: 'var(--danger-red)'
  },
  timeDot: {
    fontSize: '10px'
  },
  ticketTitle: {
    fontSize: '16px',
    fontWeight: '800',
    color: '#ffffff',
    margin: '2px 0 0',
    lineHeight: '1.4'
  },
  userSubline: {
    fontSize: '12px',
    color: 'var(--text-muted)',
    display: 'flex',
    alignItems: 'center',
    gap: '6px'
  },
  channelName: {
    color: '#8b5cf6',
    fontWeight: '600'
  },
  studentQuestion: {
    fontSize: '14px',
    lineHeight: '1.5',
    color: 'var(--text-secondary)',
    fontStyle: 'italic',
    padding: '2px 0'
  },
  aiBox: {
    backgroundColor: '#232428',
    borderRadius: '8px',
    border: '1px dashed var(--border-subtle)',
    padding: '14px 16px',
    display: 'flex',
    flexDirection: 'column',
    gap: '10px'
  },
  aiHeaderGroup: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '8px'
  },
  liveAiBadge: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
    backgroundColor: 'rgba(35, 165, 90, 0.15)',
    border: '1px solid rgba(35, 165, 90, 0.4)',
    color: '#23a55a',
    fontSize: '11px',
    fontWeight: '700',
    padding: '2px 8px',
    borderRadius: '12px'
  },
  liveDot: {
    width: '6px',
    height: '6px',
    borderRadius: '50%',
    backgroundColor: '#23a55a',
    boxShadow: '0 0 6px #23a55a'
  },
  pendingBadge: {
    backgroundColor: 'rgba(148, 155, 164, 0.15)',
    border: '1px solid rgba(148, 155, 164, 0.3)',
    color: '#949ba4',
    fontSize: '11px',
    fontWeight: '600',
    padding: '2px 8px',
    borderRadius: '12px'
  },
  aiTitle: {
    fontSize: '13px',
    fontWeight: '700',
    color: 'var(--accent-blurple)'
  },
  aiSummaryText: {
    fontSize: '13px',
    lineHeight: '1.5',
    color: 'var(--text-primary)'
  },
  aiActionRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    fontSize: '13px',
    flexWrap: 'wrap'
  },
  aiActionLabel: {
    fontWeight: '700',
    color: '#f0b232'
  },
  aiActionVal: {
    color: 'var(--text-secondary)'
  },
  sourcePill: {
    alignSelf: 'flex-start',
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
    backgroundColor: 'rgba(139, 92, 246, 0.15)',
    color: '#a78bfa',
    padding: '3px 10px',
    borderRadius: '12px',
    fontSize: '11px',
    fontWeight: '600',
    marginTop: '4px'
  },
  actionsRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    paddingTop: '6px'
  },
  btnDirect: {
    backgroundColor: 'rgba(88, 101, 242, 0.2)',
    color: '#a5b4fc',
    border: '1px solid rgba(88, 101, 242, 0.4)',
    padding: '8px 14px',
    borderRadius: '6px',
    fontSize: '13px',
    fontWeight: '700',
    cursor: 'pointer',
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
    transition: 'all 0.15s ease'
  },
  btnOutline: {
    backgroundColor: '#383a40',
    color: 'var(--text-primary)',
    border: '1px solid var(--border-subtle)',
    padding: '8px 14px',
    borderRadius: '6px',
    fontSize: '13px',
    fontWeight: '600',
    cursor: 'pointer',
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
    transition: 'background 0.15s ease'
  },
  btnSuccess: {
    backgroundColor: 'var(--success-green)',
    color: '#ffffff',
    border: 'none',
    padding: '8px 16px',
    borderRadius: '6px',
    fontSize: '13px',
    fontWeight: '700',
    cursor: 'pointer',
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
    transition: 'background 0.15s ease'
  }
};
