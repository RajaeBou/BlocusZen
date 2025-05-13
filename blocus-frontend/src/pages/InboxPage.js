import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getToken } from "../helpers/auth";

export default function InboxPage() {
  const [conversations, setConversations] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchConversations = async () => {
      const token = await getToken();
      if (!token) return;

      try {
        const res = await fetch("api/messages/conversations", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (res.ok) {
          const data = await res.json();
          setConversations(data);
        } else {
          console.error("Erreur de chargement des conversations");
        }
      } catch (err) {
        console.error("Erreur serveur :", err);
      }
    };

    fetchConversations();
  }, []);

  return (
    <div style={{ padding: "30px", maxWidth: "600px", margin: "0 auto" }}>
      <h2 style={{ fontSize: "24px", color: "#6a0dad", marginBottom: "20px" }}>
        📥 Boîte de réception
      </h2>

      {conversations.length === 0 ? (
        <p>Aucune conversation.</p>
      ) : (
        <ul style={{ listStyle: "none", padding: 0 }}>
          {conversations.map((conv) => (
            <li
              key={conv.userId}
              onClick={() => navigate(`/messages/${conv.userId}`)}
              style={{
                padding: "12px 16px",
                marginBottom: "10px",
                border: "1px solid #ddd",
                borderRadius: "8px",
                backgroundColor: "#f9f9ff",
                cursor: "pointer",
              }}
            >
              <div style={{ fontWeight: "bold", marginBottom: "4px" }}>
                {conv.name}
                {conv.isUnread && (
                  <span
                    style={{
                      backgroundColor: "#dc2626",
                      color: "white",
                      borderRadius: "12px",
                      padding: "2px 8px",
                      fontSize: "12px",
                      marginLeft: "8px",
                    }}
                  >
                    Nouveau
                  </span>
                )}
              </div>
              <div style={{ color: "#555" }}>{conv.lastMessage}</div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
