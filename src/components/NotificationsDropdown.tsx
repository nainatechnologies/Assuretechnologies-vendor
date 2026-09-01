import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  MdNotificationsNone, 
  MdShoppingCart, 
  MdWarning, 
  MdAttachMoney, 
  MdInfo,
  MdDoneAll
} from 'react-icons/md';
import API, { BASE_URL } from '../services/api';
import './NotificationsDropdown.css';

export interface VendorNotification {
  id: string;
  title: string;
  message: string;
  type: 'ORDER' | 'STOCK' | 'PAYOUT' | 'SYSTEM' | string;
  action_url?: string;
  is_read: boolean;
  target_role: string;
  target_user_id?: string;
  metadata?: any;
  createdAt: string;
}

export default function NotificationsDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<VendorNotification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    const fetchNotifications = async () => {
      setLoading(true);
      try {
        const res = await API.get('/notifications?limit=25');
        if (res.data && res.data.success) {
          setNotifications(res.data.data.notifications || []);
          setUnreadCount(res.data.data.totalUnreadCount || 0);
        }
      } catch (err) {
        console.error('Failed to fetch vendor notifications:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();

    const streamUrl = `${BASE_URL}/api/notifications/stream?clientType=vendor`;
    const eventSource = new EventSource(streamUrl, { withCredentials: true });

    eventSource.addEventListener('NEW_NOTIFICATION', (event: MessageEvent) => {
      try {
        const newNotif: VendorNotification = JSON.parse(event.data);
        setNotifications((prev) => {
          if (prev.some((n) => n.id === newNotif.id)) return prev;
          return [newNotif, ...prev];
        });
        setUnreadCount((prev) => prev + 1);
      } catch (parseErr) {
        console.error('Error parsing vendor SSE notification payload:', parseErr);
      }
    });

    eventSource.onerror = () => {};

    return () => {
      eventSource.close();
    };
  }, []);

  const handleMarkAsRead = async (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();

    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, is_read: true } : n))
    );
    setUnreadCount((prev) => Math.max(0, prev - 1));

    try {
      await API.patch(`/notifications/${id}/read`);
    } catch (err) {
      console.error('Failed to mark notification as read:', err);
    }
  };

  const handleMarkAllAsRead = async () => {
    const previousUnread = unreadCount;
    setUnreadCount(0);
    setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));

    try {
      await API.patch('/notifications/read-all');
    } catch (err) {
      console.error('Failed to mark all as read:', err);
      setUnreadCount(previousUnread);
    }
  };

  const handleNotificationClick = (notif: VendorNotification) => {
    if (!notif.is_read) {
      handleMarkAsRead(notif.id);
    }
    setIsOpen(false);
    if (notif.action_url) {
      navigate(notif.action_url);
    }
  };

  const getNotificationIcon = (type: string, title: string = '') => {
    const t = (type || title).toUpperCase();
    if (t.includes('ORDER')) {
      return <div className="vendor-notif-icon-wrap icon-order"><MdShoppingCart /></div>;
    }
    if (t.includes('STOCK')) {
      return <div className="vendor-notif-icon-wrap icon-stock"><MdWarning /></div>;
    }
    if (t.includes('PAYOUT') || t.includes('PAYMENT')) {
      return <div className="vendor-notif-icon-wrap icon-payout"><MdAttachMoney /></div>;
    }
    return <div className="vendor-notif-icon-wrap icon-default"><MdInfo /></div>;
  };

  const formatRelativeTime = (dateStr?: string) => {
    if (!dateStr) return 'Just now';
    const now = new Date();
    const date = new Date(dateStr);
    const diffMs = now.getTime() - date.getTime();
    const diffSec = Math.floor(diffMs / 1000);
    const diffMin = Math.floor(diffSec / 60);
    const diffHours = Math.floor(diffMin / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffSec < 60) return 'Just now';
    if (diffMin < 60) return `${diffMin}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString('en-IN', { day: '2-digit', month: 'short' });
  };

  return (
    <div className="vendor-notifications-dropdown-container" ref={dropdownRef}>
      <button 
        className={`vendor-notifications-bell-btn ${isOpen ? 'active' : ''}`}
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Notifications"
        title="Notifications"
      >
        <MdNotificationsNone className="vendor-bell-icon" />
        {unreadCount > 0 && (
          <span className="vendor-notif-badge-pulse">
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="vendor-notifications-panel animate-fade-in">
          <div className="vendor-notif-panel-header">
            <div className="vendor-notif-header-title">
              <h3>Vendor Alerts</h3>
              {unreadCount > 0 && <span className="vendor-unread-pill">{unreadCount} new</span>}
            </div>
            {unreadCount > 0 && (
              <button 
                className="vendor-mark-all-read-btn"
                onClick={handleMarkAllAsRead}
                title="Mark all as read"
              >
                <MdDoneAll />
                <span>Mark all read</span>
              </button>
            )}
          </div>

          <div className="vendor-notif-panel-list">
            {loading && notifications.length === 0 ? (
              <div className="vendor-notif-empty-state">Loading alerts...</div>
            ) : notifications.length === 0 ? (
              <div className="vendor-notif-empty-state">
                <MdNotificationsNone className="vendor-empty-bell-icon" />
                <p>No notifications yet</p>
              </div>
            ) : (
              notifications.map((notif) => (
                <div 
                  key={notif.id}
                  className={`vendor-notif-item ${!notif.is_read ? 'unread' : ''}`}
                  onClick={() => handleNotificationClick(notif)}
                >
                  {getNotificationIcon(notif.type, notif.title)}
                  <div className="vendor-notif-body">
                    <div className="vendor-notif-top">
                      <h4 className="vendor-notif-title">{notif.title}</h4>
                      <span className="vendor-notif-time">{formatRelativeTime(notif.createdAt)}</span>
                    </div>
                    <p className="vendor-notif-message">{notif.message}</p>
                  </div>
                  {!notif.is_read && (
                    <div className="vendor-notif-unread-dot" title="Unread" />
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
