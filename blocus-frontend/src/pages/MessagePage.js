import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { getCurrentUserId, getToken } from "../helpers/auth";
import { markMessageAsRead } from "../helpers/messages";
import Conversation from "../components/Conversation"; 

import "./MessagePage.css";


export default function MessagePage() {
  const { userId } = useParams();
  const [messages, setMessages] = useState([]);
  const [content, setContent] = useState("");
  const [currentUserId, setCurrentUserId] = useState(null);

  const fetchConversation = async () => {
    const uid = await getCurrentUserId();
    const token = await getToken();
    if (!uid || !token) return;

    setCurrentUserId(uid);

    const res = await fetch(`http://localhost:5000/api/messages/conversation/${userId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (res.ok) {
      const data = await res.json();
      setMessages(data);

      const unread = data.filter((msg) => msg.to === uid && !msg.isRead);
      await Promise.all(unread.map((msg) => markMessageAsRead(msg._id)));

    
      window.dispatchEvent(
        new CustomEvent("updateUnreadMessages", {
          detail: (prev) => Math.max(0, prev - unread.length),
        })
      );
    } else {
      console.error("Erreur chargement messages");
    }
  };

  useEffect(() => {
    fetchConversation();
    const interval = setInterval(fetchConversation, 5000);
    return () => clearInterval(interval);
  }, [userId]);

  const sendMessage = async () => {
    const token = await getToken();
    if (!content.trim() || !token) return;

    const res = await fetch("http://localhost:5000/api/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ to: userId, content }),
    });

    if (res.ok) {
      setContent("");
      fetchConversation();
    } else {
      alert("Erreur envoi message");
    }
  };

  return (
    <div className="chat-wrapper">
      <h2 className="chat-title">💬 Conversation</h2>
  
      <div className="chat-box">
        <Conversation messages={messages} />
      </div>
  
      <div className="chat-input">
        <input
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Écris un message..."
        />
        <button onClick={sendMessage}>Envoyer</button>
      </div>
    </div>
  );
  
}
