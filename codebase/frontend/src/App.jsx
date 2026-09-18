import React, { useState, useEffect } from 'react';
import ServerSidebar from './components/ServerSidebar';
import ChannelSidebar from './components/ChannelSidebar';
import HeaderBar from './components/HeaderBar';
import MetricsGrid from './components/MetricsGrid';
import FilterBar from './components/FilterBar';
import TicketCard from './components/TicketCard';
import AIReplyModal from './components/AIReplyModal';
import Toast from './components/Toast';
import { INITIAL_TICKETS, INITIAL_METRICS } from './data/initialData';
import { ChevronDown, PlusCircle, Sparkles, Loader2, X } from 'lucide-react';

export default function App() {
  const [tickets, setTickets] = useState(INITIAL_TICKETS);
  const [metrics, setMetrics] = useState(INITIAL_METRICS);
  const [activeCategory, setActiveCategory] = useState('all');
  const [activeModalTicket, setActiveModalTicket] = useState(null);
  const [toastMessage, setToastMessage] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const [isCustomModalOpen, setIsCustomModalOpen] = useState(false);
  const [customTitle, setCustomTitle] = useState('');
  const [customContent, setCustomContent] = useState('');
  const [customWaitTime, setCustomWaitTime] = useState(130);
  const [isClassifyingCustom, setIsClassifyingCustom] = useState(false);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage('');
    }, 4500);
  };

  // Nạp danh sách Ticket thật từ backend (từ eval/golden_set.json)
  useEffect(() => {
    fetch('/api/tickets?limit=8')
      .then((res) => res.json())
      .then((data) => {
        if (data && data.tickets && data.tickets.length > 0) {
          setTickets(data.tickets);
          const urgentCount = data.tickets.filter((t) => t.statusType === 'urgent').length;
          setMetrics((prev) => ({
            ...prev,
            totalOpen: data.tickets.length,
            missedUrgent: urgentCount
          }));
          showToast(`🚀 Đã nạp ${data.tickets.length} Ticket thật từ eval/golden_set.json!`);
        }
      })
      .catch((err) => {
        console.log('Backend chưa kết nối, dùng dữ liệu mẫu:', err);
      });
  }, []);

  // Resolve Ticket handler
  const handleResolveTicket = (ticketId) => {
    setTickets((prev) => prev.filter((t) => t.id !== ticketId));
    setMetrics((prev) => ({
      ...prev,
      totalOpen: Math.max(0, prev.totalOpen - 1),
      missedUrgent: Math.max(0, prev.missedUrgent - 1),
      resolvedToday: prev.resolvedToday + 1
    }));
    showToast('🎉 Đã đánh dấu xử lý xong Ticket! Hệ thống đã tự cập nhật cho TA.');
  };

  // Open AI Reply Modal
  const handleOpenModal = (ticket) => {
    setActiveModalTicket(ticket);
  };

  // Send AI Reply
  const handleSendAIReply = (ticketId, draftText) => {
    setActiveModalTicket(null);
    handleResolveTicket(ticketId);
    showToast('⚡ Câu trả lời AI đã được gửi trực tiếp tới thread Discord học viên!');
  };

  // Open Direct Link
  const handleOpenOriginal = (ticket) => {
    showToast(`🔗 Đang mở Direct Link Discord -> Chuyển thẳng tới kênh ${ticket.channel} của ${ticket.userName}...`);
  };

  // Trigger AI Scan thật: Gửi Ticket đầu tiên chưa phân tích lên AI backend
  const handleTriggerAIScan = async () => {
    if (isScanning) return;
    const targetTicket = tickets.find((t) => !t.isAnalyzed) || tickets[0];
    if (!targetTicket) {
      showToast('Tất cả ticket đều đã được AI phân tích!');
      return;
    }

    setIsScanning(true);
    showToast(`🤖 Đang gọi mô hình AI thật để phân tích [${targetTicket.id}]...`);

    try {
      const res = await fetch('/api/classify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ticket_id: targetTicket.id,
          title: targetTicket.title,
          author: targetTicket.studentId || 'Học viên',
          wait_time_minutes: parseInt(targetTicket.timeElapsed) || 120,
          content: targetTicket.studentQuestion
        })
      });

      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      const ai = data.ai_result;

      // Cập nhật ticket với kết quả AI thật
      setTickets((prev) =>
        prev.map((t) => {
          if (t.id === targetTicket.id) {
            const isUrgent = ai.priority === 'MISS_GAP';
            return {
              ...t,
              statusTag: isUrgent ? `🚨 MISS GẤP (${t.timeElapsed})` : ai.priority === 'TRUNG_BINH' ? `🟡 TRUNG BÌNH (${t.timeElapsed})` : `🟢 THẤP FAQ (${t.timeElapsed})`,
              statusType: isUrgent ? 'urgent' : ai.priority === 'TRUNG_BINH' ? 'warning' : 'new',
              aiSummary: ai.ai_summary,
              aiSuggestedAction: ai.suggested_action,
              aiDraftReply: `Chào ${t.userName}!\n\n${ai.ai_summary}\n\n👉 Hướng giải quyết đề xuất: ${ai.suggested_action}\n\nChúc em học tập tốt!`,
              aiModel: ai.model_used || 'gpt-4o-mini',
              aiLatency: `${ai.latency_seconds}s`,
              isAnalyzed: true
            };
          }
          return t;
        })
      );

      showToast(`✅ AI [${ai.provider_used.toUpperCase()}] phân tích xong trong ${ai.latency_seconds}s! Gắn cờ: [${ai.priority}]`);
    } catch (err) {
      console.error(err);
      showToast(`❌ Lỗi gọi AI backend: ${err.message}. Hãy đảm bảo server python codebase/api.py đang chạy.`);
    } finally {
      setIsScanning(false);
    }
  };

  // Thử nghiệm phân loại câu hỏi bất kỳ (Phục vụ Test Thẻ Giám Khảo CP6)
  const handleClassifyCustomTicket = async (e) => {
    e.preventDefault();
    if (!customTitle || !customContent) {
      showToast('Vui lòng nhập đầy đủ tiêu đề và nội dung câu hỏi!');
      return;
    }

    setIsClassifyingCustom(true);
    showToast('🤖 AI đang suy luận trực tiếp câu hỏi từ giám khảo...');

    try {
      const res = await fetch('/api/classify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ticket_id: `JUDGE-${Date.now().toString().slice(-4)}`,
          title: customTitle,
          author: 'Học viên Test',
          wait_time_minutes: customWaitTime,
          content: customContent
        })
      });

      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      const ai = data.ai_result;

      const isUrgent = ai.priority === 'MISS_GAP';
      const newCard = {
        id: `T-JUDGE-${Date.now().toString().slice(-4)}`,
        cardId: `ticket-judge`,
        userInitials: 'GK',
        avatarBg: '#5865f2',
        userName: 'Thẻ Giám Khảo Live',
        studentId: 'JUDGE-CARD',
        channel: '#live-judge-test',
        timeElapsed: `${Math.floor(customWaitTime / 60)}h ${customWaitTime % 60}m`,
        statusTag: isUrgent ? `🚨 MISS GẤP (${Math.floor(customWaitTime / 60)}h)` : `🟡 ${ai.priority}`,
        statusType: isUrgent ? 'urgent' : 'warning',
        category: ai.category.toLowerCase().includes('cvat') ? 'cvat' : 'logistics',
        title: customTitle,
        studentQuestion: customContent,
        aiSummary: ai.ai_summary,
        aiSuggestedAction: ai.suggested_action,
        aiDraftReply: `Chào bạn!\n\n${ai.ai_summary}\n\n👉 Đề xuất: ${ai.suggested_action}`,
        aiModel: ai.model_used || 'gpt-4o-mini',
        aiLatency: `${ai.latency_seconds}s`,
        isAnalyzed: true
      };

      setTickets((prev) => [newCard, ...prev]);
      setMetrics((prev) => ({
        ...prev,
        totalOpen: prev.totalOpen + 1,
        missedUrgent: isUrgent ? prev.missedUrgent + 1 : prev.missedUrgent
      }));

      setIsCustomModalOpen(false);
      setCustomTitle('');
      setCustomContent('');
      showToast(`🎉 AI thật phản hồi trong ${ai.latency_seconds}s! Đã thêm Ticket vào danh sách.`);
    } catch (err) {
      showToast(`❌ Lỗi: ${err.message}`);
    } finally {
      setIsClassifyingCustom(false);
    }
  };

  // Filter tickets
  const filteredTickets = tickets.filter((t) => {
    if (activeCategory === 'all') return true;
    if (activeCategory === 'urgent') return t.statusType === 'urgent';
    if (activeCategory === 'cvat') return t.category === 'cvat';
    if (activeCategory === 'logistics') return t.category === 'logistics';
    return true;
  });

  return (
    <div style={styles.appContainer}>
      {/* 1. Far Left Server Sidebar */}
      <ServerSidebar />

      {/* 2. Channel Sidebar */}
      <ChannelSidebar badgeCount={tickets.length} />

      {/* 3. Main Chat Canvas */}
      <main style={styles.mainCanvas}>
        {/* Top Header */}
        <HeaderBar />

        {/* Dashboard Content Container */}
        <div style={styles.dashboardContainer}>
          {/* Metrics Grid */}
          <MetricsGrid metrics={metrics} />

          {/* Filter Bar */}
          <FilterBar
            activeCategory={activeCategory}
            onSelectCategory={setActiveCategory}
            onTriggerScan={handleTriggerAIScan}
            countMap={{ all: tickets.length }}
          />

          {/* Ticket List Header */}
          <div style={styles.listHeaderRow}>
            <div style={styles.titleStack}>
              <h2 style={styles.sectionTitle}>Ticket cần được hỗ trợ</h2>
              <span style={styles.sectionSubtext}>
                {filteredTickets.length} cuộc hội thoại đang mở · sắp xếp theo mức độ khẩn cấp
              </span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <button
                onClick={() => setIsCustomModalOpen(true)}
                style={styles.judgeCardBtn}
              >
                <Sparkles size={14} color="#f0b232" />
                <span>Thử nghiệm Thẻ Giám Khảo</span>
              </button>

              <div style={styles.sortDropdown}>
                <span>Mới nhất</span>
                <ChevronDown size={14} color="#b5bac1" />
              </div>
            </div>
          </div>

          {/* Ticket Cards Feed */}
          <div style={styles.ticketFeed}>
            {filteredTickets.length > 0 ? (
              filteredTickets.map((t) => (
                <TicketCard
                  key={t.id}
                  ticket={t}
                  onOpenModal={handleOpenModal}
                  onResolve={handleResolveTicket}
                  onOpenOriginal={handleOpenOriginal}
                />
              ))
            ) : (
              <div style={styles.emptyState}>
                <span>🎉 Không còn ticket nào trong danh mục này!</span>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Modals & Toasts */}
      <AIReplyModal
        ticket={activeModalTicket}
        onClose={() => setActiveModalTicket(null)}
        onSend={handleSendAIReply}
      />

      {/* Modal Thử nghiệm Thẻ Giám Khảo (Live AI) */}
      {isCustomModalOpen && (
        <div style={styles.overlay}>
          <div style={styles.judgeModal}>
            <div style={styles.modalHeader}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Sparkles size={18} color="#f0b232" />
                <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#fff', margin: 0 }}>
                  Thử nghiệm Thẻ Giám Khảo (Gọi AI Thật Live)
                </h3>
              </div>
              <button onClick={() => setIsCustomModalOpen(false)} style={styles.iconBtn}>
                <X size={18} color="#949ba4" />
              </button>
            </div>

            <form onSubmit={handleClassifyCustomTicket} style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginTop: '16px' }}>
              <div>
                <label style={styles.formLabel}>Tiêu đề Ticket:</label>
                <input
                  style={styles.formInput}
                  placeholder="VD: Không khởi động được Docker CVAT"
                  value={customTitle}
                  onChange={(e) => setCustomTitle(e.target.value)}
                  required
                />
              </div>

              <div>
                <label style={styles.formLabel}>Nội dung câu hỏi học viên:</label>
                <textarea
                  style={{ ...styles.formInput, height: '75px', resize: 'vertical' }}
                  placeholder="VD: Em chạy lệnh cvat-server bị báo lỗi 500 ở bước OPA, đã chờ 3 tiếng chưa ai rep..."
                  value={customContent}
                  onChange={(e) => setCustomContent(e.target.value)}
                  required
                />
              </div>

              <div>
                <label style={styles.formLabel}>Thời gian học viên đã chờ (phút):</label>
                <input
                  type="number"
                  style={styles.formInput}
                  value={customWaitTime}
                  onChange={(e) => setCustomWaitTime(Number(e.target.value))}
                  min={1}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '8px' }}>
                <button
                  type="button"
                  onClick={() => setIsCustomModalOpen(false)}
                  style={styles.cancelBtn}
                >
                  Đóng
                </button>
                <button
                  type="submit"
                  disabled={isClassifyingCustom}
                  style={styles.submitBtn}
                >
                  {isClassifyingCustom ? 'Đang gọi AI suy luận...' : '⚡ Bấm để AI Phân tích'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <Toast message={toastMessage} />
    </div>
  );
}

const styles = {
  appContainer: {
    display: 'flex',
    width: '100vw',
    height: '100vh',
    overflow: 'hidden',
    backgroundColor: 'var(--bg-darkest)'
  },
  mainCanvas: {
    flex: 1,
    backgroundColor: 'var(--bg-chat)',
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden'
  },
  dashboardContainer: {
    flex: 1,
    overflowY: 'auto',
    padding: '24px',
    display: 'flex',
    flexDirection: 'column',
    gap: '20px'
  },
  listHeaderRow: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: '6px'
  },
  titleStack: {
    display: 'flex',
    flexDirection: 'column',
    gap: '2px'
  },
  sectionTitle: {
    fontSize: '18px',
    fontWeight: '800',
    color: '#ffffff'
  },
  sectionSubtext: {
    fontSize: '12px',
    color: 'var(--text-muted)'
  },
  sortDropdown: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    fontSize: '13px',
    fontWeight: '600',
    color: 'var(--text-secondary)',
    cursor: 'pointer',
    backgroundColor: '#2b2d31',
    padding: '6px 12px',
    borderRadius: '6px',
    border: '1px solid var(--border-subtle)'
  },
  ticketFeed: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px'
  },
  emptyState: {
    backgroundColor: '#2b2d31',
    borderRadius: '12px',
    padding: '40px',
    textAlign: 'center',
    color: 'var(--text-muted)',
    fontSize: '15px',
    border: '1px dashed var(--border-subtle)'
  },
  judgeCardBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    backgroundColor: '#5865f2',
    color: '#ffffff',
    border: 'none',
    padding: '7px 14px',
    borderRadius: '6px',
    fontSize: '13px',
    fontWeight: '700',
    cursor: 'pointer',
    transition: 'background 0.2s'
  },
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
  judgeModal: {
    backgroundColor: '#313338',
    borderRadius: '12px',
    width: '540px',
    maxWidth: '90vw',
    padding: '24px',
    boxShadow: '0 8px 24px rgba(0, 0, 0, 0.5)',
    border: '1px solid var(--border-subtle)'
  },
  modalHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottom: '1px solid var(--border-subtle)',
    paddingBottom: '12px'
  },
  iconBtn: {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    padding: '4px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  formLabel: {
    display: 'block',
    fontSize: '12px',
    fontWeight: '700',
    color: 'var(--text-muted)',
    textTransform: 'uppercase',
    marginBottom: '6px'
  },
  formInput: {
    width: '100%',
    backgroundColor: '#1e1f22',
    border: '1px solid var(--border-subtle)',
    borderRadius: '6px',
    padding: '10px 12px',
    color: '#f2f3f5',
    fontSize: '14px',
    outline: 'none',
    boxSizing: 'border-box'
  },
  cancelBtn: {
    backgroundColor: 'transparent',
    color: '#f2f3f5',
    border: 'none',
    padding: '8px 16px',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '14px'
  },
  submitBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    backgroundColor: '#23a55a',
    color: '#ffffff',
    border: 'none',
    padding: '8px 18px',
    borderRadius: '6px',
    fontSize: '14px',
    fontWeight: '700',
    cursor: 'pointer'
  }
};
