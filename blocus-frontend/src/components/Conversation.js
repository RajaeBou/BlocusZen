import React, { useEffect, useState, useRef } from "react";
import { getCurrentUserId, getToken } from "../helpers/auth";
import "./Conversation.css"; // 👈 à créer juste après

export default function Conversation({ messages }) {
  const [participants, setParticipants] = useState({});
  const [currentUserId, setCurrentUserId] = useState("");
  const bottomRef = useRef(null);

  useEffect(() => {
    const scrollToBottom = () => {
      if (bottomRef.current) {
        bottomRef.current.scrollIntoView({ behavior: "smooth" });
      }
    };
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    const loadUID = async () => {
      const uid = await getCurrentUserId();
      setCurrentUserId(uid);
    };
    loadUID();
  }, []);

  useEffect(() => {
    const fetchParticipants = async () => {
      const token = await getToken();
      const userIds = Array.from(
        new Set(messages.flatMap((msg) => [msg.from, msg.to]))
      );

      try {
        const results = await Promise.all(
          userIds.map(async (uid) => {
            const res = await fetch(`http://localhost:5000/api/profile/${uid}`, {
              headers: { Authorization: `Bearer ${token}` },
            });
            const data = await res.json();
            return { uid, name: data.name || "Inconnu" };
          })
        );

        const map = {};
        results.forEach((p) => (map[p.uid] = { name: p.name }));
        setParticipants(map);
      } catch (err) {
        console.error("Erreur chargement participants :", err);
      }
    };

    if (messages.length > 0) fetchParticipants();
  }, [messages]);

  return (
    <div className="conversation-container">
      {messages.map((msg, index) => {
        const isMine = msg.from === currentUserId;
        const previous = messages[index - 1];
        const showName = index === 0 || previous?.from !== msg.from;
        const senderName = isMine ? "Vous" : participants[msg.from]?.name || "Inconnu";

        return (
          <div
            key={msg._id || index}
            className={`message-block ${isMine ? "sent" : "received"}`}
          >
            {showName && (
              <div className="sender-name">{senderName}</div>
            )}
            <div className="message-bubble">{msg.content}</div>
          </div>
        );
      })}
      <div ref={bottomRef} />
    </div>
  );
}
