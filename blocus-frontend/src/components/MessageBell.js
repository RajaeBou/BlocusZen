import React, { useEffect, useState } from "react";
import { Mail } from "lucide-react";
import { Link } from "react-router-dom";
import { getCurrentUserId, getToken } from "../helpers/auth";
import './MessageBell.css';

export default function MessageBell() {
  const [unreadMessages, setUnreadMessages] = useState(0);

  useEffect(() => {
    const fetchUnread = async () => {
      const uid = await getCurrentUserId();
      const token = await getToken();
      if (!uid || !token) return;

      try {
        const res = await fetch("http://localhost:5000/api/messages/conversations", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (res.ok) {
          const data = await res.json();
          const unreadCount = data.filter((conv) => conv.isUnread).length;
          setUnreadMessages(unreadCount);
        }
      } catch (error) {
        console.error("Erreur chargement messages non lus:", error);
      }
    };

    fetchUnread();
    const interval = setInterval(fetchUnread, 5000);

    const updateHandler = (e) => {
      setUnreadMessages((prev) =>
        typeof e.detail === "function" ? e.detail(prev) : e.detail
      );
    };

    window.addEventListener("updateUnreadMessages", updateHandler);
    return () => {
      clearInterval(interval);
      window.removeEventListener("updateUnreadMessages", updateHandler);
    };
  }, []);

  return (
    <Link to="/messages" className="message-wrapper">
  <Mail className="message-icon" />
  {unreadMessages > 0 && (
    <span className="message-badge">{unreadMessages}</span>
  )}
</Link>

  );
}
