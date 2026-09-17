import React, { useState } from 'react';
import ServerSidebar from './components/ServerSidebar';
import ChannelSidebar from './components/ChannelSidebar';
import HeaderBar from './components/HeaderBar';
import MetricsGrid from './components/MetricsGrid';
import FilterBar from './components/FilterBar';
import TicketCard from './components/TicketCard';
import AIReplyModal from './components/AIReplyModal';
import Toast from './components/Toast';
import { INITIAL_TICKETS, INITIAL_METRICS } from './data/initialData';
import { ChevronDown } from 'lucide-react';

export default function App() {
  const [tickets, setTickets] = useState(INITIAL_TICKETS);
  const [metrics, setMetrics] = useState(INITIAL_METRICS);
  const [activeCategory, setActiveCategory] = useState('all');
  const [activeModalTicket, setActiveModalTicket] = useState(null);
  const [toastMessage, setToastMessage] = useState('');

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage('');
    }, 3500);
  };

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

  // Trigger AI Scan
  const handleTriggerAIScan = () => {
    showToast('🔄 AI Pipeline đang quét lại toàn bộ 24 kênh Discord & Ticket...');
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

            <div style={styles.sortDropdown}>
              <span>Mới nhất</span>
              <ChevronDown size={14} color="#b5bac1" />
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
  }
};
