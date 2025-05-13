import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getToken } from "../helpers/auth";
import VideoChat from "../components/VideoChat";
import ChatComponent from "../components/ChatComponent";

export default function SessionLive() {
  const { id } = useParams();
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [timeLeft, setTimeLeft] = useState("");
  const [note, setNote] = useState("");
  const [aiInput, setAiInput] = useState("");
  const [aiResponse, setAiResponse] = useState("");
  const [aiLoading, setAiLoading] = useState(false);

  useEffect(() => {
    const fetchSession = async () => {
      try {
        const token = await getToken();
        const res = await fetch(`api/liveSessions/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        setSession(data);
        setNote(data.note || "");
        setLoading(false);

        const updateCountdown = () => {
          const now = new Date();
          const endDate = new Date(`${data.date}T${data.endTime}`);
          const diffMs = endDate - now;

          if (diffMs <= 0) {
            setTimeLeft("✅ Session terminée");
            return;
          }

          const totalSeconds = Math.floor(diffMs / 1000);
          const hours = Math.floor(totalSeconds / 3600);
          const minutes = Math.floor((totalSeconds % 3600) / 60);
          const seconds = totalSeconds % 60;

          const format = (num) => (num < 10 ? "0" + num : num);
          setTimeLeft(`${format(hours)}:${format(minutes)}:${format(seconds)}`);
        };

        updateCountdown();
        const interval = setInterval(updateCountdown, 1000);
        return () => clearInterval(interval);
      } catch (err) {
        console.error("Erreur session live :", err);
        setLoading(false);
      }
    };
    fetchSession();
  }, [id]);

  
  
  

  useEffect(() => {
    if (!session) return;

    const timeout = setTimeout(async () => {
      try {
        const token = await getToken();
        await fetch(`api/liveSessions/${session._id}/note`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ note }),
        });
      } catch (err) {
        console.error("Erreur enregistrement note :", err);
      }
    }, 1000);

    return () => clearTimeout(timeout);
  }, [note, session]);

  const handleAskAI = async () => {
    if (!aiInput.trim()) return;
    setAiLoading(true);
    setAiResponse("");

    try {
      const res = await fetch("api/ai/generate-summary", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ subject: aiInput }),
      });

      const data = await res.json();
      setAiResponse(data.summary);
    } catch (err) {
      console.error("Erreur IA :", err);
      setAiResponse("❌ Erreur lors de la demande à l'IA.");
    } finally {
      setAiLoading(false);
    }
  };

  if (loading) return <p>Chargement...</p>;
  if (!session) return <p>❌ Aucune session trouvée</p>;

  return (
    <div style={{ padding: "20px", maxWidth: "700px", margin: "0 auto" }}>
      <h2>📚 {session.subject}</h2>
      <p>🕒 {session.startTime} → {session.endTime}</p>
      <p>🔐 {session.visibility}</p>
      <p>⏱️ Temps restant : <strong>{timeLeft}</strong></p>

      
      {session.visibility === "public" && (
  <>
    <VideoChat session={session} userName="Ton prénom" />
    <ChatComponent sessionId={session._id} />
  </>
)}
      
  
  <label style={{ fontWeight: "bold" }}>📝 Tes notes pendant la session :</label>

      <div style={{ marginTop: "20px" }}>
        <textarea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="Écris tes idées, rappels, formules..."
          style={{
            width: "100%",
            minHeight: "150px",
            padding: "10px",
            fontSize: "16px",
            borderRadius: "8px",
            border: "1px solid #ccc",
            marginTop: "10px",
          }}
        />
      </div>

      <div style={{ marginTop: "30px" }}>
        <label style={{ fontWeight: "bold" }}>🤖 Aide de l’IA – Résumé par sujet :</label>
        <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
          <input
            type="text"
            placeholder="Ex: les réseaux, la POO..."
            value={aiInput}
            onChange={(e) => setAiInput(e.target.value)}
            style={{
              flex: 1,
              padding: "10px",
              borderRadius: "6px",
              border: "1px solid #ccc",
            }}
          />
          <button onClick={handleAskAI}>Demander</button>
        </div>

        {aiLoading && (
          <p style={{ marginTop: "15px", color: "#888" }}>⏳ L’IA réfléchit...</p>
        )}

        {aiResponse && (
          <div
            style={{
              marginTop: "15px",
              background: "#f3f3f3",
              padding: "15px",
              borderRadius: "8px",
            }}
          >
            <strong>🧠 Résumé de l’IA :</strong>
            <p>{aiResponse}</p>
          </div>
        )}
      </div>
    </div>
  );
}
