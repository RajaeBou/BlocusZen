import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { getToken } from "../helpers/auth";
import "./NotificationDropdown.css";

export default function NotificationDropdown() {
  const [notifications, setNotifications] = useState([]);
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  const getCurrentUserId = async () => {
    const token = await getToken();
    if (!token) return null;
    const payload = JSON.parse(atob(token.split(".")[1]));
    return payload.user_id || payload.userId || null;
  };

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const userId = await getCurrentUserId();
        if (!userId) return;

        const token = await getToken();
        const res = await fetch(`http://localhost:5000/api/notifications/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) throw new Error("Erreur API");
        const data = await res.json();
        setNotifications(data);
      } catch (err) {
        console.error("Erreur chargement notifications:", err);
      }
    };

    fetchNotifications();
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const markAsRead = async (id) => {
    try {
      await fetch(`http://localhost:5000/api/notifications/read/${id}`, {
        method: "POST",
      });
      setNotifications((prev) =>
        prev.map((n) => (n._id === id ? { ...n, isRead: true } : n))
      );
    } catch (err) {
      console.error("Erreur mise à jour notification:", err);
    }
  };

  return (
    <div className="invitation-dropdown-container" ref={dropdownRef}>
      <div className="invitation-icon" onClick={() => setOpen(!open)}>
        🔔
        {unreadCount > 0 && <span className="invitation-badge">{unreadCount}</span>}
      </div>

      {open && (
        <div className="invitation-menu">
          <div className="invitation-menu-content">
            {notifications.length === 0 ? (
              <p style={{ padding: "10px", fontStyle: "italic", color: "#666" }}>
                Aucune notification.
              </p>
            ) : (
              notifications.map((n) => (
                <div
                  key={n._id}
                  className="invitation-item"
                  onClick={() => {
                    markAsRead(n._id);
                    if (n.type === "invite") navigate("/invitations");
                    else if (n.type === "reminder") navigate("/mes-sessions");
                    
                    setOpen(false);
                  }}
                >
                  {n.type === "invite" && "📩 "}
                  {n.type === "reminder" && "⏰ "}
                  {n.type === "message" && "💬 "}
                  {n.content}
                </div>
              ))
            )}
          </div>
          <div className="invitation-footer">
            <button
              onClick={() => {
                navigate("/notifications");
                setOpen(false);
              }}
            >
              Voir tout
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
