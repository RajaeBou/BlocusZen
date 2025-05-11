import React, { useEffect, useState, useRef } from "react";
import { Bell } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { getCurrentUserId } from "../helpers/auth";
import { getNotifications, markNotificationAsRead } from "../helpers/notifications";
import "./NotificationBell.css";

const NotificationBell = () => {
  const [notifications, setNotifications] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [prevUnread, setPrevUnread] = useState(0);
  const [shouldBounce, setShouldBounce] = useState(false);
  const navigate = useNavigate();
  const wrapperRef = useRef(null);

  const unreadCount = notifications.filter((n) => !n.isRead && n.type !== "message").length;

  const fetchNotifications = async () => {
    const uid = await getCurrentUserId();
    if (!uid) return;

    try {
      const allTypes = ["invite", "message", "reminder"];
      const results = await Promise.all(
        allTypes.map((type) => getNotifications(uid, { type }))
      );
      const merged = results.flat().sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      setNotifications(merged);
    } catch (err) {
      console.error("Erreur chargement notifs :", err);
    }
  };

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 5000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (isOpen) fetchNotifications();
  }, [isOpen]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (unreadCount > prevUnread) {
      setShouldBounce(true);
      setTimeout(() => setShouldBounce(false), 600);
    }
    setPrevUnread(unreadCount);
  }, [unreadCount]);

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = (now - date) / 1000;

    if (diff < 60) return "maintenant";
    if (diff < 3600) return `${Math.floor(diff / 60)} min ago`;
    if (now.toDateString() === date.toDateString())
      return `${date.getHours()}:${String(date.getMinutes()).padStart(2, "0")}`;
    return date.toLocaleDateString();
  };

  const markAllAsReadByType = async (type) => {
    const unreadOfType = notifications.filter(n => n.type === type && !n.isRead);
    await Promise.all(unreadOfType.map(n => markNotificationAsRead(n._id)));
    fetchNotifications();
  };

  const handleClick = async (notif) => {
    await markNotificationAsRead(notif._id);
    if (notif.type === "invite") navigate("/invitations");
    else if (notif.type === "message") navigate("/messages");
    else if (notif.type === "reminder") navigate("/mes-sessions");
  };

  const groupByType = (typeLabel, icon, typeKey, route) => {
    const items = notifications.filter((n) => n.type === typeKey);
    const unread = items.filter((n) => !n.isRead).length;
    const latest = items[0];

    return (
      <div className="notif-category" onClick={async () => {
        await markAllAsReadByType(typeKey);
        navigate(route);
      }}>
        <div className="notif-header">
          <span className="notif-label">{icon} {typeLabel}</span>
          {unread > 0 && (
  <span className="notif-badge">{unread}</span>
)}
        </div>
        {latest ? (
          <div className="notif-content">
            <div className="notif-message">{latest.content}</div>
            <div className="notif-time">{formatTime(latest.createdAt)}</div>
          </div>
        ) : (
          <div className="notif-empty">Aucune notification</div>
        )}
      </div>
    );
  };

  return (
    <div ref={wrapperRef} className="notification-wrapper">
      <button onClick={() => setIsOpen(!isOpen)} className="notification-button">
        <Bell className={`w-6 h-6 bell-icon ${shouldBounce ? "bell-bounce" : ""}`} />
        {unreadCount > 0 && (
  <span className="notification-badge shake-badge">{unreadCount}</span>
)}

      </button>

      {isOpen && (
        <div className="notification-dropdown">
          <div className="notification-title">Notifications</div>
          <div className="notification-list">
            {groupByType("Invitations", "📨", "invite", "/invitations")}
            {groupByType("Rappels", "⏰", "reminder", "/mes-sessions")}
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationBell;
