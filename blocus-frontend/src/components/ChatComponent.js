import React, { useState, useEffect } from "react";

export default function ChatComponent({ sessionId }) {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");

  useEffect(() => {
    // Exemple : Fetch initial messages
    async function fetchMessages() {
      try {
        const response = await fetch(`/api/sessions/${sessionId}/messages`);
        if (response.ok) {
          const data = await response.json();
          setMessages(data);
        }
      } catch (err) {
        console.error("Erreur lors de la récupération des messages :", err);
      }
    }

    fetchMessages();

    // Si tu utilises WebSocket ou Socket.io, tu peux aussi écouter les nouveaux messages ici
  }, [sessionId]);

  const sendMessage = async () => {
    if (!newMessage.trim()) return;
    try {
      const response = await fetch(`/api/sessions/${sessionId}/messages`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ content: newMessage }),
      });

      if (response.ok) {
        const message = await response.json();
        setMessages((prevMessages) => [...prevMessages, message]);
        setNewMessage("");
      }
    } catch (err) {
      console.error("Erreur lors de l'envoi du message :", err);
    }
  };

  return (
    <div style={{ border: "1px solid #ccc", padding: "10px", borderRadius: "8px", maxWidth: "400px", margin: "0 auto" }}>
      <h3>💬 Chat</h3>
      <div style={{ maxHeight: "200px", overflowY: "auto", marginBottom: "10px" }}>
        {messages.map((message, index) => (
          <div key={index} style={{ marginBottom: "8px" }}>
            <strong>{message.author}</strong>: {message.content}
          </div>
        ))}
      </div>
      <input
        type="text"
        placeholder="Ecris ton message..."
        value={newMessage}
        onChange={(e) => setNewMessage(e.target.value)}
        style={{ width: "100%", padding: "8px", marginBottom: "10px" }}
      />
      <button onClick={sendMessage} style={{ width: "100%", padding: "8px" }}>
        Envoyer
      </button>
    </div>
  );
}
